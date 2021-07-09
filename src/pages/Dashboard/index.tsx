import React, { useCallback } from 'react';
import { FiTrash2, FiPlus, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import TimerItem from '../../components/TimerItem';
import { Container, WorkspaceItem, NoSelectedWorkspace, Commands, Recent } from './styles';
import { useWorkspace } from '../../hooks/workspace';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDrop } from 'react-dnd';
import welcomeLogo from '../../assets/welcomeLogo.png';
import Key from '../../components/Key';
import formatTime from '../../utils/formatTime';
import { ipcRenderer } from 'electron';

const Dashboard: React.FC = () => {
  const { red, text } = useTheme();
  const { editWorkspace, recents, saveWorkspaces, createNewTimerModal, workspaces, selectedWorkspace, createWorkspaceModal, setSelectedWorkspace, deleteWorkspace } = useWorkspace();

  const handleDragEnd = useCallback(result => {
    if (!result.destination) return;

    const workspacesCopy = workspaces;

    const [reorderedItem] = workspacesCopy.splice(result.source.index, 1);
    workspacesCopy.splice(result.destination.index, 0, reorderedItem);

    saveWorkspaces(workspacesCopy);
  }, [workspaces]);

  const [{ }, dropRef] = useDrop({
    accept: 'TIMER_ITEM',
    drop: () => {
      if (!selectedWorkspace) return;
      editWorkspace(selectedWorkspace.id, { timers: selectedWorkspace.timers });
    }
  });

  return (
    <Container>
      <aside>
        <h1>Workspaces</h1>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="workspaces">
            {provided => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {workspaces.map((workspace, index) => (
                  <Draggable key={workspace.id} index={index} draggableId={workspace.id}>
                    {provided => (
                      <WorkspaceItem
                        onClick={() => setSelectedWorkspace(workspace)}
                        isActive={Number((selectedWorkspace || { id: null }).id === workspace.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {workspace.name}
                        <FiTrash2 size={16} color={red} onClick={e => {
                          e.stopPropagation();
                          deleteWorkspace(workspace.id);
                        }} />
                      </WorkspaceItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <footer>
          <FiSliders size={20} color={text} />
          <FiFolderPlus onClick={createWorkspaceModal} size={20} color={text} />
        </footer>
      </aside>
      <main>
        {selectedWorkspace ? (
          <>
            <h1>
              <span
                suppressContentEditableWarning
                contentEditable
                onKeyDown={ev => {
                  switch (ev.key) {
                    case 'Enter': {
                      ev.preventDefault();

                      if (!ev.currentTarget.innerText) return;

                      ev.currentTarget.blur();
                      editWorkspace(selectedWorkspace.id, { ...selectedWorkspace, name: ev.currentTarget.innerText })
                      break;
                    }
                    case 'Escape': {
                      ev.preventDefault();
                      ev.currentTarget.blur();
                      ev.currentTarget.innerText = selectedWorkspace.name;
                      break;
                    }
                  }
                }}
              >
                {selectedWorkspace.name}
              </span>
              <button onClick={createNewTimerModal}>
                <FiPlus size={20} color={text} />
                New
              </button>
            </h1>
            <ul ref={dropRef}>
              {selectedWorkspace.timers.map((timer, index) => (
                <TimerItem index={index} data={timer} key={timer.id} />
              ))}
            </ul>
          </>
        ) : (
          <NoSelectedWorkspace>
            <img src={welcomeLogo} alt="Logo" />
            <p>Select or create a workspace to get started.</p>
            <div>
              <Commands>
                <li>
                  <Key>⌘</Key> <Key>N</Key> New Untitled Timer
                </li>
                <li>
                  <Key>⌘</Key> <Key>W</Key> Close Window
                </li>
                <li>
                  <Key>⇧</Key> <Key>⌘</Key> <Key>T</Key> Open Dashboard
                </li>
              </Commands>
              <Recent>
                <p>Recent</p>
                {recents.map(timer => (
                  <li>
                    <span
                      onClick={() => {
                        ipcRenderer.send('create-timer-window', timer);
                      }}
                    >
                      {timer.name}
                    </span> — {formatTime(timer.time)}
                  </li>
                ))}
                {!recents.length && <li>No recent opened timers.</li>}
              </Recent>
            </div>
          </NoSelectedWorkspace>
        )}
      </main>
    </Container>
  );
}

export default Dashboard;