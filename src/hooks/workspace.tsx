import { ipcRenderer } from 'electron';
import { Formik, Form } from 'formik';
import React, { createContext, useCallback, useContext, useState } from 'react';
import Input from '../components/Input';
import { useModal } from './modal';
import * as yup from 'yup';
import styled from 'styled-components';

const TimeInput = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.6rem;
`;

const ButtonsContainer = styled.div`
    min-width: 50%;
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr;

    > button {
        padding: 12px 16px;
        border-radius: 4px;
        border: 0;
        font: 500 0.8rem Montserrat, sans-serif;
        color: ${({ theme }) => theme.text};
        cursor: pointer;
        transition: filter .2s;

        :hover {
            filter: brightness(0.85);
        }

        :active {
            filter: brightness(0.75);
        }
    }

    > button:first-child {
        background: ${({ theme }) => theme.blue};
    }

    > button:last-child {
        background: ${({ theme }) => theme.red};
        font-weight: 600;
    }
`;

interface WorkspaceContextContent {
  workspaces: Workspace[],
  selectedWorkspace: Workspace | null,
  createWorkspace(props: { name: string }): void,
  deleteTimer(id: string): void,
  deleteWorkspace(id: string): void,
  createWorkspaceModal(): void,
  createTimer(props: { name: string, hours: number, minutes: number, seconds: number, workspaceId: string }): void,
  createNewTimerModal(): void,
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>,
  editWorkspace(id: string, data: Partial<Workspace>): void
}

const WorkspaceContext = createContext<WorkspaceContextContent>({} as WorkspaceContextContent);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }

  return context;
}

const workspaceValidation = yup.object().shape({
  name: yup.string().required('Name is required')
});

const timerValidation = yup.object().shape({
  name: yup.string().required('Name is required'),
  hours: yup.number(),
  minutes: yup.number(),
  seconds: yup.number().required('Seconds are required')
});


export const WorkspaceProvider: React.FC = ({ children }) => {
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

  const deleteTimer = useCallback((id: string) => {
    setWorkspaces(ipcRenderer.sendSync('get-workspaces'));
    setSelectedWorkspace(ipcRenderer.sendSync('delete-timer', id));
  }, []);

  const deleteWorkspace = (id: string) => {
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

  const createTimer = useCallback(({ name, hours, minutes, seconds, workspaceId }) => {
    hide();

    const finalTimer: ITimerDTO = {
      name,
      time: (hours * 60 * 60) + (minutes * 60) + seconds,
      workspaceId
    }

    ipcRenderer.sendSync('create-timer', finalTimer);

    setSelectedWorkspace((ipcRenderer.sendSync('get-workspaces') as Workspace[]).find(workspace => workspace.id === workspaceId) || null);
    setWorkspaces(ipcRenderer.sendSync('get-workspaces'));
  }, []);

  const editWorkspace = useCallback((id, data) => {
    setSelectedWorkspace((ipcRenderer.sendSync('edit-workspace', id, data) as Workspace[]).find(workspace => workspace.id === id) || null);
    setWorkspaces(ipcRenderer.sendSync('get-workspaces'));
  }, []);

  const createNewTimerModal = useCallback(() => {
    if (!selectedWorkspace) return;

    setContent(
      (
        <Formik
          initialValues={{ name: '', hours: '', minutes: '', seconds: '', workspaceId: selectedWorkspace.id }}
          onSubmit={createTimer}
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
  }, [selectedWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        editWorkspace,
        selectedWorkspace,
        createWorkspace,
        deleteTimer,
        deleteWorkspace,
        setSelectedWorkspace,
        createWorkspaceModal,
        createTimer,
        createNewTimerModal
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}