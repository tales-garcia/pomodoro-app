import React, { useCallback, useMemo } from 'react';
import { FiTrash2, FiPlus, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import TimerItem from '../../components/TimerItem';
import { Container, WorkspaceItem, NoSelectedWorkspace, Commands, Recent } from './styles';
import { useWorkspace } from '../../hooks/workspace';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDrop } from 'react-dnd';
import welcomeLogo from '../../assets/welcomeLogo.png';
import welcomeLogoLight from '../../assets/welcomeLogoLight.png';
import Key from '../../components/Key';
import formatTime from '../../utils/formatTime';
import { ipcRenderer } from 'electron';
import { useLocalization } from '../../hooks/localization';
import { useThemeHelper } from '../../hooks/theme';

const Dashboard: React.FC = () => {
  const { red, text } = useTheme();
  const { mode } = useThemeHelper();
  const { editWorkspace, recents, saveWorkspaces, createNewTimerModal, workspaces, selectedWorkspace, createWorkspaceModal, setSelectedWorkspace, deleteWorkspace } = useWorkspace();
  const { dashboard: { close, getStarted, create, newTimer, noRecent, openDashboard, recent, workspacesTitle } } = useLocalization();

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

  const comandOrControl = useMemo(() => process.platform === 'darwin' ? '⌘' : '⌃', [process.platform]);

  return (
    <Container>
      <aside>
        <h1>{workspacesTitle}</h1>
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
                        <span>{workspace.name}</span>
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
                {create}
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
            <img src={mode === 'dark' ? welcomeLogo : welcomeLogoLight} alt="Logo" />
            <p>{getStarted}</p>
            <div>
              <Commands>
                <li>
                  <Key>{comandOrControl}</Key> <Key>N</Key> {newTimer}
                </li>
                <li>
                  <Key>{comandOrControl}</Key> <Key>W</Key> {close}
                </li>
                <li>
                  <Key>⇧</Key> <Key>{comandOrControl}</Key> <Key>T</Key> {openDashboard}
                </li>
              </Commands>
              <Recent>
                <p>{recent}</p>
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
                {!recents.length && <li>{noRecent}</li>}
              </Recent>
            </div>
          </NoSelectedWorkspace>
        )}
      </main>
    </Container>
  );
}

export default Dashboard;