import { ipcRenderer } from 'electron';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { FiTrash2, FiPlus, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import Input from '../../components/Input';
import TimerItem from '../../components/TimerItem';
import { useModal } from '../../hooks/modal';
import { Container, WorkspaceItem, TimeInput, ButtonsContainer } from './styles';
import * as yup from 'yup';

const workspaceValidation = yup.object().shape({
  name: yup.string().required('Name is required')
});

const timerValidation = yup.object().shape({
  name: yup.string().required('Name is required'),
  hours: yup.number(),
  minutes: yup.number(),
  seconds: yup.number().required('Seconds are required')
});

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
          validationSchema={workspaceValidation}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={createWorkspace}
        >
          <Form>
            <h2>New workspace</h2>
            <Input name="name" type="text" placeholder="Name" />
            <ButtonsContainer>
              <button type="button" onClick={hide}>Cancel</button>
              <button type="submit">Confirm</button>
            </ButtonsContainer>
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
          initialValues={{ name: '', hours: '', minutes: '', seconds: '' }}
          onSubmit={console.log}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={timerValidation}
        >
          <Form>
            <h2>New timer</h2>
            <Input name="name" type="text" placeholder="Name" />
            <TimeInput>
              <Input name="hours" type="number" placeholder="Hours" />:
              <Input name="minutes" type="number" placeholder="Minutes" />:
              <Input name="seconds" type="number" placeholder="Seconds" />
            </TimeInput>
            <ButtonsContainer>
              <button type="button" onClick={hide}>Cancel</button>
              <button type="submit">Confirm</button>
            </ButtonsContainer>
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
            <WorkspaceItem key={workspace.id} onClick={() => setSelectedWorkspace(workspace)} isActive={Number((selectedWorkspace || { id: null }).id === workspace.id)}>
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
              <button onClick={createNewTimerModal}>
                <FiPlus size={20} color={text} />
                New
              </button>
            </h1>
            <ul>
              {selectedWorkspace.timers.map(timer => (
                <TimerItem name={timer.name} key={timer.id} time={timer.time} />
              ))}
            </ul>
          </>
        )}
      </main>
    </Container>
  );
}

export default Dashboard;