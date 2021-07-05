import React, { useCallback } from 'react';
import { FiTrash2, FiPlus, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import TimerItem from '../../components/TimerItem';
import { Container, WorkspaceItem } from './styles';
import { useWorkspace } from '../../hooks/workspace';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Dashboard: React.FC = () => {
  const { red, text } = useTheme();
  const { editWorkspace, saveWorkspaces, createNewTimerModal, workspaces, selectedWorkspace, createWorkspaceModal, setSelectedWorkspace, deleteWorkspace } = useWorkspace();

  const handleDragEnd = useCallback(result => {
    const workspacesCopy = workspaces;

    const [reorderedItem] = workspacesCopy.splice(result.source.index, 1);
    workspacesCopy.splice(result.destination.index, 0, reorderedItem);

    saveWorkspaces(workspacesCopy);
  }, [workspaces]);

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
        {selectedWorkspace && (
          <>
            <h1>
              <span
                suppressContentEditableWarning
                contentEditable
                onKeyDown={ev => {
                  switch(ev.key) {
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
            <ul>
              {selectedWorkspace.timers.map(timer => (
                <TimerItem data={timer} key={timer.id} />
              ))}
            </ul>
          </>
        )}
      </main>
    </Container>
  );
}

export default Dashboard;