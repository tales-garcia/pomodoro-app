import { ipcRenderer, remote } from 'electron';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { ThemeContext } from 'styled-components';

import { Container } from './styles';

interface ClockProps {
    time: number;
    maxTime: number;
}

const Clock: React.FC<ClockProps> = ({ time: propsTime, maxTime: propsMaxTime }) => {
    const [time, setTime] = useState<number | null>(propsTime || null);
    const [isActive, setIsActive] = useState(false);
    const [inputTime, setInputTime] = useState(['--', '--']);
    const [maxTime, setMaxTime] = useState<number | null>(propsMaxTime || propsTime || null);

    const minutes = useMemo(() => time ? Math.floor(time / 60) : null, [time]);
    const seconds = useMemo(() => time ? time % 60 : null, [time]);

    const splittedMinutes = useMemo(() => String(minutes).padStart(2, '0').split(''), [minutes]);
    const splittedSeconds = useMemo(() => String(seconds).padStart(2, '0').split(''), [seconds]);

    useEffect(() => {
        ipcRenderer.on('set-time', (_, time) => {
            if (!time) {
                setInputTime(['--', '--']);
            } else {
                setInputTime([String(Math.floor(time / 60)), String(time % 60)])
            }
            setMaxTime(time || null);
            setTime(time || null);
            setIsActive(false);
        });
    }, []);

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
            const timeout = setTimeout(() => setTime(time - 1), 1000);
            return () => clearTimeout(timeout);
        } else if (isActive && time === 0) {
            resetCounter()
            new Notification('Timer finished');
        }
    }, [isActive, time]);

    useEffect(() => {
        if (!inputTime.some(text => !text)) {
            const [minutes, seconds] = inputTime;

            const time = (Number(minutes) * 60) + Number(seconds);
            setTime(time);
            setMaxTime(time);
        }
    }, [inputTime]);

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
            setInputTime(['--', '--']);
        },
        [maxTime]
    )

    const { red } = useContext(ThemeContext);

    return (
        <Container>
            <CircularProgressbarWithChildren
                value={time!}
                maxValue={maxTime!}
                strokeWidth={2}
                styles={buildStyles({
                    pathColor: red,
                    trailColor: "transparent"
                })}
            >

                <div>
                    <span
                        suppressContentEditableWarning
                        contentEditable={!isActive}
                        onInput={(e) => {
                            if (e.currentTarget.textContent && !(/(0|1|2|3|4|5|6|7|8|9|-)/.test(e.currentTarget.textContent))) {
                                e.currentTarget.textContent = inputTime[0];
                            }
                        }}
                        onKeyPress={e => {
                            if (isNaN(Number(e.key)) || e.key === ' ') e.preventDefault();
                        }}
                        onBlur={e => {
                            if (!e.currentTarget.textContent?.match(/(0|1|2|3|4|5|6|7|8|9)/)) {
                                e.currentTarget.textContent = '--';
                                return;
                            }
                            setInputTime([e.currentTarget.textContent!.replace(/[^0-9]/g, ''), inputTime[1]]);
                        }}
                    >
                        {!!time ? splittedMinutes : inputTime[0]}
                    </span>
                    :
                    <span
                        suppressContentEditableWarning
                        contentEditable={!isActive}
                        onInput={(e) => {
                            if (e.currentTarget.textContent && !(/(0|1|2|3|4|5|6|7|8|9|-)/.test(e.currentTarget.textContent))) {
                                e.currentTarget.textContent = inputTime[1];
                            }
                        }}
                        onKeyPress={e => {
                            if (isNaN(Number(e.key)) || e.key === ' ') e.preventDefault();
                        }}
                        onBlur={e => {
                            if (!e.currentTarget.textContent?.match(/(0|1|2|3|4|5|6|7|8|9)/)) {
                                e.currentTarget.textContent = '--';
                                return;
                            }
                            setInputTime([inputTime[0], e.currentTarget.textContent!.replace(/[^0-9]/g, '')]);
                        }}
                    >
                        {!!time ? splittedSeconds : inputTime[1]}
                    </span>
                </div>

                <p style={{ opacity: time ? 1 : 0.5, cursor: time ? 'pointer' : 'not-allowed' }} onClick={!!time ? toggleCounter : undefined}>{isActive ? 'PAUSE' : 'START'}</p>
            </CircularProgressbarWithChildren>

            <p style={{ opacity: (time || inputTime.some(input => /(0|1|2|3|4|5|6|7|8|9)/i.test(input))) ? 1 : 0.5, cursor: (time || inputTime.some(input => /(0|1|2|3|4|5|6|7|8|9)/i.test(input))) ? 'pointer' : 'not-allowed' }} onClick={resetCounter}>RESET</p>
        </Container>
    );
}

export default Clock;