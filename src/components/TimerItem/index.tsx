import { ipcRenderer } from 'electron';
import React, { useCallback, useMemo, useState } from 'react';
import { FiPlay, FiEdit, FiTrash } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import { useWorkspace } from '../../hooks/workspace';
import Button from '../Button';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import NumberEditableContent from '../NumberEditableContent';
import { Container, ButtonsContainer } from './styles';
import { useDrag, useDrop } from 'react-dnd';

interface TimerItemProps {
    data: Timer;
    index: number;
}

const TimerItem: React.FC<TimerItemProps> = ({ data: { name, time, id }, index }) => {
    const { red, text, blue } = useTheme();
    const { deleteTimer, editTimer, setSelectedWorkspace } = useWorkspace();
    const ref = React.useRef<HTMLLIElement>(null);

    const [editMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [{ isDragging }, drag, dragPreview] = useDrag({
        item: { index },
        type: 'TIMER_ITEM',
        collect: (monitor) => ({ isDragging: monitor.isDragging() })
    });

    const moveTimerHandler = useCallback((dragIndex, hoverIndex) => {
        setSelectedWorkspace(prevState => {
            if (!prevState) return null;

            const prevStateCopy = {...prevState};
            const timers = prevStateCopy.timers;

            if (!timers || !timers[dragIndex] || !timers[hoverIndex]) return prevState;

            const [dragItem] = timers.splice(dragIndex, 1);
            timers.splice(hoverIndex, 0, dragItem);

            return { ...prevState, timers };
        })
    }, []);

    const [{}, drop] = useDrop<Pick<TimerItemProps, 'index'>, any, any>({
        accept: 'TIMER_ITEM',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) return;

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveTimerHandler(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const hours = useMemo(() => time ? Math.floor(time / 3600) : null, [time]);
    const minutes = useMemo(() => time ? Math.floor(time % 3600 / 60) : null, [time]);
    const seconds = useMemo(() => time ? Math.floor(time % 3600 % 60) : null, [time]);

    const stringHours = useMemo(() => String(hours).padStart(2, '0'), [hours]);
    const stringMinutes = useMemo(() => String(minutes).padStart(2, '0'), [minutes]);
    const stringSeconds = useMemo(() => String(seconds).padStart(2, '0'), [seconds]);

    const [showingValues, setShowingValues] = useState<{ [key: string]: any }>({ hours: stringHours, minutes: stringMinutes, seconds: stringSeconds, name });
    const [editValues, setEditValues] = useState<{ [key: string]: any }>({ hours: stringHours, minutes: stringMinutes, seconds: stringSeconds, name });

    const openTimer = useCallback(() => {
        ipcRenderer.send('create-timer-window', {
            time,
            name
        });
    }, [time, name]);

    const handleDeleteTimer = useCallback(() => deleteTimer(id), [id]);

    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev)
    }, []);

    const handleEditTimer = useCallback(() => {
        const { hours, minutes, seconds, name: editedName } = editValues;

        const finalTime = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds);

        const finalValues: Partial<Timer> = {
            time: finalTime,
            name: editedName
        };

        setShowingValues(editValues);
        setEditMode(false);
        editTimer(id, finalValues);
    }, [showingValues, id, editValues]);

    drag(drop(ref));

    const display = useMemo(() => isDragging ? 'none' : 'flex', [isDragging]);

    return (
        <AnimateSharedLayout>
            {isDragging && (
                <Container
                    ref={dragPreview}
                    style={{
                        backgroundColor: blue,
                        borderColor: red,
                        borderWidth: 2,
                        borderStyle: 'solid'
                    }}
                />
            )}
            <Container
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                ref={ref}
                style={{ display }}
                layoutId={id}
            >
                {editMode ? (
                    <motion.h2 layoutId="time">
                        {!!hours && (
                            <>
                                <NumberEditableContent
                                    onChange={value => setEditValues({ ...editValues, hours: value })}
                                >
                                        {showingValues.hours}
                                </NumberEditableContent>
                                <span>:</span>
                            </>
                        )}
                        <NumberEditableContent
                            onChange={value => setEditValues({ ...editValues, minutes: value })}
                        >
                            {showingValues.minutes}
                        </NumberEditableContent>
                        <span>:</span>
                        <NumberEditableContent
                            onChange={value => setEditValues({ ...editValues, seconds: value })}
                        >
                            {showingValues.seconds}
                        </NumberEditableContent>
                    </motion.h2>
                ) : (
                    <motion.h2 layoutId="time">{!!hours && <>{showingValues.hours}<span>:</span></>}{showingValues.minutes}<span>:</span>{showingValues.seconds}</motion.h2>
                )}
                <motion.h3
                    contentEditable={editMode}
                    layoutId="name"
                    onKeyDown={e => {
                        switch (e.key) {
                            case 'Enter': {
                                e.preventDefault();
                                e.currentTarget.blur();
                                break;
                            }
                            case 'Escape': {
                                e.preventDefault();
                                e.currentTarget.textContent = showingValues.name;
                                e.currentTarget.blur();
                                break;
                            }
                        }
                    }}
                    onInput={e => setEditValues({ ...editValues, name: e.currentTarget.textContent })}
                >
                    {showingValues.name}
                </motion.h3>
                <AnimatePresence>
                    {!editMode && (
                        <motion.footer
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <FiPlay onClick={openTimer} size={20} color={text} />
                            <FiEdit size={20} color={text} onClick={toggleEditMode} />
                            <FiTrash size={20} color={red} onClick={handleDeleteTimer} />
                        </motion.footer>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {editMode && (
                        <ButtonsContainer
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                        >
                            <Button 
                                onClick={() => {
                                    toggleEditMode();
                                    setEditValues(showingValues);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button confirmButton onClick={handleEditTimer}>Confirm</Button>
                        </ButtonsContainer>
                    )}
                </AnimatePresence>
            </Container>
        </AnimateSharedLayout>
    );
}

export default TimerItem;