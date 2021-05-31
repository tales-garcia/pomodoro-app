import { ipcRenderer } from 'electron';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { FiTrash2, FiPlus, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import Input from '../../components/Input';
import TimerItem from '../../components/TimerItem';
import { useModal } from '../../hooks/modal';
import { Container, WorkspaceItem } from './styles';

const Dashboard: React.FC = () => {
  const { red, text } = useTheme();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(ipcRenderer.sendSync('get-workspaces'));
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const { setContent, show, hide } = useModal();

  const createWorkspace = useCallback(({ name }) => {
    hide();

    const workspace = {
      name: name,
      timers: []
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

  const createWorkspaceModal = useCallback(() => {
    setContent(
      (
        <Formik
          initialValues={{ name: '' }}
          onSubmit={createWorkspace}
        >
          <Form>
            <h2>New workspace</h2>
            <Input name="name" type="text" placeholder="Name" />
            <div>
              <button type="button" onClick={hide}>Cancel</button>
              <button type="submit">Confirm</button>
            </div>
          </Form>
        </Formik>
      )
    );

    show();
  }, []);

  const createNewTimerModal = useCallback(() => {
    setContent(
      (
        <Formik
          initialValues={{ title: '', time: '' }}
          onSubmit={console.log}
        >
          <Form>
            <h2>New timer</h2>
            <Input name="title" type="text" placeholder="Name" />
            <Input name="time" type="text" placeholder="Time" />
            <div>
              <button type="button" onClick={hide}>Cancel</button>
              <button type="submit">Confirm</button>
            </div>
          </Form>
        </Formik>
      )
    );

    show();
  }, []);

  return (
    <Container>
      <aside>
        <h1>Workspaces</h1>
        <ul>
          {workspaces.map((workspace) => (
            <WorkspaceItem onClick={() => setSelectedWorkspace(workspace)} isActive={Number((selectedWorkspace || { id: null }).id === workspace.id)}>
              {workspace.name}
              <FiTrash2 size={16} color={red} onClick={e => {
                e.stopPropagation();
                handleWorkspaceDelete(workspace.id);
              }} />
            </WorkspaceItem>
          ))}
        </ul>

        <footer>
          <FiSliders size={20} color={text} />
          <FiFolderPlus onClick={createWorkspaceModal} size={20} color={text} />
        </footer>
      </aside>
      <main>
        {selectedWorkspace && (
          <>
            <h1>
              {selectedWorkspace.name}
              <button>
                <FiPlus size={20} color={text} />
                New
              </button>
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