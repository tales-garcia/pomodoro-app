import { ipcRenderer, remote } from 'electron';
import { Form, Formik } from 'formik';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import { useModal } from './modal';
import * as Yup from 'yup';
import { useLocalization } from './localization';

const ButtonsContainer = styled.div`
    min-width: 50%;
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr;
`;

interface TimerContextContent {
    time: number | null;
    name: string;
    isActive: boolean;
    maxTime: number | null;
    inputTime: {
        seconds: string;
        minutes: string;
        hours: string;
    };
    setInputTime: React.Dispatch<React.SetStateAction<{
        seconds: string;
        minutes: string;
        hours: string;
    }>>;
    toggleCounter: () => void;
    resetCounter: () => void;
    saveTimer: () => void;
}

const TimerContext = createContext<TimerContextContent>({} as TimerContextContent);

export const useTimer = () => {
    const context = useContext(TimerContext);

    if (!context) {
        throw new Error('useTimer must be used within TimerProvider');
    }

    return context;
}

const {
    storedTime, storedMaxTime, name, id: initialId
} = ipcRenderer.sendSync('get-timer-props', remote.getCurrentWindow().id);

export const TimerProvider: React.FC = ({ children }) => {
    const [time, setTime] = useState<number | null>(storedTime || null);
    const [isActive, setIsActive] = useState(false);
    const [maxTime, setMaxTime] = useState<number | null>(storedMaxTime || storedTime || null);
    const [id, setId] = useState<string>(initialId);
    const modal = useModal();
    const { shared: { untitled, validation: { invalidSelection }, timerFinished, buttons: { cancel, confirm }, dropdown: { selectAWorkspace, noWorkspaces } } } = useLocalization()

    const [inputTime, setInputTime] = useState({
        seconds: '--',
        minutes: '--',
        hours: '00'
    });

    const workspaceSelectValidation = useMemo(() => Yup.object().shape({
        workspace: Yup.string().required(invalidSelection)
    }), [invalidSelection]);

    useEffect(() => {
        remote.getCurrentWindow().setTitle(`${!!name ? `${name} - ` : `${untitled} - `}Timer`);

        if (!!id) {
            ipcRenderer.send('save-recent', id);
        } else if (!!storedMaxTime) {
            const finalTimer: Timer = {
                id: v4(),
                name: !!name ? name : untitled,
                time: storedMaxTime
            };

            ipcRenderer.send('save-recent', finalTimer);
        }
    }, [id]);

    useEffect(() => {
        ipcRenderer.on('set-time', (_, time) => {
            if (!time) {
                setInputTime({
                    seconds: '--',
                    minutes: '--',
                    hours: '--'
                });
            } else {
                setInputTime({
                    hours: String(Math.floor(time / 3600)).padStart(2, '0'),
                    minutes: String(Math.floor(time % 3600 / 60)).padStart(2, '0'),
                    seconds: String(Math.floor(time % 3600 % 60)).padStart(2, '0')
                })
            }
            setMaxTime(time || null);
            setTime(time || null);
            setIsActive(false);
        });
    }, []);

    useEffect(() => {
        ipcRenderer.on('save-timer', saveTimer);
    }, [time]);

    const toggleCounter = useCallback(
        () => {
            setIsActive(!isActive);
        },
        [isActive, setIsActive],
    );

    const resetCounter = useCallback(
        () => {
            setIsActive(false);
            setTime(maxTime);
            setInputTime({
                seconds: '--',
                minutes: '--',
                hours: '--'
            });
        },
        [maxTime]
    );

    const handleGetTimeReply = useCallback(() => {
        ipcRenderer.send('get-time-reply', time, maxTime)
    }, [time, maxTime])

    useEffect(() => {
        ipcRenderer.removeAllListeners('get-time');

        if (time) {
            ipcRenderer.addListener('get-time', handleGetTimeReply);
        } else {
            ipcRenderer.addListener('get-time', () => ipcRenderer.send('get-time-reply', null));
        }

        if (isActive && time && time > 0) {
            const timeout = setTimeout(() => {
                setTime(time - 1);
                setInputTime({
                    hours: String(Math.floor((time - 1) / 3600)).padStart(2, '0'),
                    minutes: String(Math.floor((time - 1) % 3600 / 60)).padStart(2, '0'),
                    seconds: String(Math.floor((time - 1) % 3600 % 60)).padStart(2, '0')
                });
            }, 1000);
            return () => clearTimeout(timeout);
        } else if (isActive && time === 0) {
            resetCounter()
            new Notification(timerFinished);
        }
    }, [isActive, time]);

    useEffect(() => {
        if (!Object.keys(inputTime).some(text => !(inputTime as any)[text] || isNaN(Number((inputTime as any)[text])))) {
            const { minutes, seconds, hours } = inputTime;

            const textTime = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);

            if (textTime === time) {
                return;
            }

            setTime(textTime);
            setMaxTime(textTime);
        }
    }, [inputTime]);

    const saveTimer = useCallback(() => {
        if (!time) return;

        if (id) {
            ipcRenderer.sendSync('edit-timer', id, { time } as Timer);
        } else {
            const workspaces = ipcRenderer.sendSync('get-workspaces') as Workspace[];

            const formattedWorkspaces = workspaces.map(workspace => ({
                label: workspace.name,
                value: workspace.id
            }));

            modal.setContent((
                <Formik
                    initialValues={{ workspace: '' }}
                    onSubmit={handleSaveSubmit}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={workspaceSelectValidation}
                >
                    <Form>
                        <Dropdown
                            placeholder={selectAWorkspace}
                            noOptionsMessage={() => noWorkspaces}
                            options={formattedWorkspaces}
                            name='workspace'
                        />
                        <ButtonsContainer>
                            <Button onClick={modal.hide} type="button">{cancel}</Button>
                            <Button type="submit" confirmButton>{confirm}</Button>
                        </ButtonsContainer>
                    </Form>
                </Formik>
            ));
            modal.show();
        }

    }, [time, id]);

    const handleSaveSubmit = useCallback(({ workspace }) => {
        if (!time || !workspace) return;

        const timerDto = {
            name: !!name ? name : untitled,
            time,
            workspaceId: workspace
        } as ITimerDTO;

        const generatedTimer = ipcRenderer.sendSync('create-timer', timerDto);
        modal.hide();
        setId(generatedTimer.id);
    }, [time, name]);

    return (
        <TimerContext.Provider
            value={{
                time,
                name,
                isActive,
                maxTime,
                inputTime,
                setInputTime,
                toggleCounter,
                resetCounter,
                saveTimer
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}