import React, { useContext, useMemo } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { ThemeContext } from 'styled-components';
import { useLocalization } from '../../hooks/localization';
import { useTimer } from '../../hooks/timer';
import formatTime from '../../utils/formatTime';

import { Container } from './styles';

const Clock: React.FC = () => {
    const { time, isActive, maxTime, inputTime, setInputTime, toggleCounter, resetCounter } = useTimer();
    const { timer: { start, pause } } = useLocalization()

    const [stringHours, stringMinutes, stringSeconds] = useMemo(() => {
        if (!time) return [];

        const splittedTime = formatTime(time).split(':') as (string | undefined)[];

        if (splittedTime.length === 2) splittedTime.unshift(undefined);

        return splittedTime;
    }, [time]);

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
                    {!!stringHours && (
                        <>
                            <span
                                suppressContentEditableWarning
                                contentEditable={!isActive}
                                onInput={(e) => {
                                    if (e.currentTarget.textContent && !(/(0|1|2|3|4|5|6|7|8|9|-)/.test(e.currentTarget.textContent))) {
                                        e.currentTarget.textContent = inputTime.hours;
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
                                    setInputTime({
                                        ...inputTime,
                                        hours: e.currentTarget.textContent!.replace(/[^0-9]/g, '').padStart(2, '0')
                                    });
                                }}
                            >
                                {!!time ? stringHours : inputTime.hours}
                            </span>
                            :
                        </>
                    )}
                    <span
                        suppressContentEditableWarning
                        contentEditable={!isActive}
                        onInput={(e) => {
                            if (e.currentTarget.textContent && !(/(0|1|2|3|4|5|6|7|8|9|-)/.test(e.currentTarget.textContent))) {
                                e.currentTarget.textContent = inputTime.minutes;
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
                            setInputTime({
                                ...inputTime,
                                minutes: e.currentTarget.textContent!.replace(/[^0-9]/g, '').padStart(2, '0')
                            });
                        }}
                    >
                        {!!time ? stringMinutes : inputTime.minutes}
                    </span>
                    :
                    <span
                        suppressContentEditableWarning
                        contentEditable={!isActive}
                        onInput={(e) => {
                            if (e.currentTarget.textContent && !(/(0|1|2|3|4|5|6|7|8|9|-)/.test(e.currentTarget.textContent))) {
                                e.currentTarget.textContent = inputTime.seconds;
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
                            setInputTime({
                                ...inputTime,
                                seconds: e.currentTarget.textContent!.replace(/[^0-9]/g, '').padStart(2, '0')
                            });
                        }}
                    >
                        {!!time ? stringSeconds : inputTime.seconds}
                    </span>
                </div>

                <p style={{ opacity: time ? 1 : 0.5, cursor: time ? 'pointer' : 'not-allowed' }} onClick={!!time ? toggleCounter : undefined}>{isActive ? pause : start}</p>
            </CircularProgressbarWithChildren>

            <p style={{ opacity: (time || Object.keys(inputTime).some(key => /(0|1|2|3|4|5|6|7|8|9)/i.test((inputTime as any)[key]))) ? 1 : 0.5, cursor: (time || Object.keys(inputTime).some(key => /(0|1|2|3|4|5|6|7|8|9)/i.test((inputTime as any)[key]))) ? 'pointer' : 'not-allowed' }} onClick={resetCounter}>RESET</p>
        </Container>
    );
}

export default Clock;