import React, { useEffect, useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { WorkspaceTooltip } from './styles';

interface WorkspaceTitleProps {
    name: string;
}

const WorkspaceTitle: React.FC<WorkspaceTitleProps> = ({ name }) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    const truncated = useMemo(() => spanRef.current?.offsetWidth! < spanRef.current?.scrollWidth!, [spanRef.current?.offsetWidth, spanRef.current?.scrollWidth]);

    useEffect(() => {
        ReactTooltip.rebuild();
        console.log(truncated, name)
    }, [truncated]);

    return (
        <>
            <span ref={spanRef} data-tip={truncated ? name : undefined}>{name}</span>
            <WorkspaceTooltip multiline delayShow={1000} effect='solid' arrowColor='#000' />
        </>
    );
}

export default WorkspaceTitle;