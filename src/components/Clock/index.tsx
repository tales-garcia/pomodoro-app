import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { ThemeContext } from 'styled-components';

import { Container } from './styles';

const Clock: React.FC = () => {
    const [time, setTime] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [inputTime, setInputTime] = useState(['--', '--']);

    const minutes = useMemo(() => time ? Math.floor(time / 60) : null, [time]);
    const seconds = useMemo(() => time ? time % 60 : null, [time]);
    const maxTime = useMemo(() => (Number(inputTime[0]) * 60) + Number(inputTime[1]), [inputTime]);

    const splittedMinutes = useMemo(() => String(minutes).padStart(2, '0').split(''), [minutes]);
    const splittedSeconds = useMemo(() => String(seconds).padStart(2, '0').split(''), [seconds]);

    useEffect(() => {
        if (isActive && time && time > 0) {
            const timeout = setTimeout(() => setTime(time - 1), 1000);
            return () => clearTimeout(timeout);
        } else if (isActive && time === 0) {
            resetCounter()
        }
    }, [isActive, time]);

    useEffect(() => {
        if (!inputTime.some(text => !text)) {
            const [minutes, seconds] = inputTime;

            const time = (Number(minutes) * 60) + Number(seconds);
            setTime(time);
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
                            if (!(/(0|1|2|3|4|5|6|7|8|9)/.test(e.currentTarget.textContent!)) && e.currentTarget.textContent) {
                                e.currentTarget.textContent = inputTime[0];
                            }
                        }}
                        onBlur={e => {
                            setInputTime([e.currentTarget.textContent!.replace(/-/g, '')!, inputTime[1]]);
                        }}
                    >
                        {!!time ? splittedMinutes : inputTime[0]}
                    </span>
                    :
                    <span
                        suppressContentEditableWarning
                        contentEditable={!isActive}
                        onInput={(e) => {
                            if (!(/(0|1|2|3|4|5|6|7|8|9)/.test(e.currentTarget.textContent!)) && e.currentTarget.textContent) {
                                e.currentTarget.textContent = inputTime[1];
                            }
                        }}
                        onBlur={e => {
                            setInputTime([inputTime[0], e.currentTarget.textContent!.replace(/-/g, '')!]);
                        }}
                    >
                        {!!time ? splittedSeconds : inputTime[1]}
                    </span>
                </div>

                <p style={{ opacity: time ? 1 : 0.5, cursor: time ? 'pointer' : 'not-allowed' }} onClick={!!time ? toggleCounter : undefined}>{isActive ? 'PAUSE' : 'START'}</p>
            </CircularProgressbarWithChildren>
        </Container>
    );
}

export default Clock;