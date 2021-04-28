import { ipcRenderer } from 'electron';
import React, { useCallback, useState } from 'react';
import { FiTrash2, FiEdit2, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import TimerItem from '../../components/TimerItem';
import { Container, WorkspaceItem } from './styles';

const Dashboard: React.FC = () => {
  const { red, text } = useTheme();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(ipcRenderer.sendSync('get-workspaces'));
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const createWorkspace = useCallback(() => {
    const workspace = {
      name: 'Studies',
      timers: [
        {
          name: 'React',
          time: 600
        }
      ]
    }

    const generatedWorkspace = ipcRenderer.sendSync('create-workspace', workspace) as Workspace;

    if (generatedWorkspace) {
      setWorkspaces((prevState) => [...prevState, generatedWorkspace]);
    }
  }, []);

  const handleWorkspaceDelete = (id: string) => {
    if (!selectedWorkspace || id !== selectedWorkspace.id) {
      setWorkspaces(ipcRenderer.sendSync('delete-workspace', id));
      return;
    }

    let selectedWorkspaceIndex = workspaces.findIndex((workspace) => workspace.id === selectedWorkspace.id);

    if (workspaces[selectedWorkspaceIndex + 1]) selectedWorkspaceIndex++;
    else if (workspaces[selectedWorkspaceIndex - 1]) selectedWorkspaceIndex--;
    else {
      setSelectedWorkspace(null);
      setWorkspaces(ipcRenderer.sendSync('delete-workspace', id));
      return;
    }
    setSelectedWorkspace(workspaces[selectedWorkspaceIndex]);
    setWorkspaces(ipcRenderer.sendSync('delete-workspace', id));
  }

  return (
    <Container>
      <aside>
        <h1>Workspaces</h1>
        <ul>
          {workspaces.map((workspace) => (
            <WorkspaceItem onClick={() => setSelectedWorkspace(workspace)} isActive={Number((selectedWorkspace || { id: null }).id === workspace.id)}>
              Studies
              <FiTrash2 size={16} color={red} onClick={e => {
                e.stopPropagation();
                handleWorkspaceDelete(workspace.id);
              }} />
            </WorkspaceItem>
          ))}
        </ul>

        <footer>
          <FiSliders size={20} color={text} />
          <FiFolderPlus onClick={createWorkspace} size={20} color={text} />
        </footer>
      </aside>
      <main>
        {selectedWorkspace && (
          <>
            <h1>
              {selectedWorkspace.name}
              <FiEdit2 size={28} color={text} />
            </h1>
            <ul>
              {selectedWorkspace.timers.map(timer => (
                <TimerItem name={timer.name} time={timer.time} />
              ))}
            </ul>
          </>
        )}
      </main>
    </Container>
  );
}

export default Dashboard;