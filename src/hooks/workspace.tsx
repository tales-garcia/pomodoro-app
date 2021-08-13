import { ipcRenderer } from 'electron';
import { Formik, Form } from 'formik';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Input from '../components/Input';
import { useModal } from './modal';
import * as yup from 'yup';
import styled from 'styled-components';
import Button from '../components/Button';
import { useLocalization } from './localization';

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
  editWorkspace(id: string, data: Partial<Workspace>): void,
  editTimer(id: string, data: Partial<Timer>): void,
  saveWorkspaces(workspaces: Workspace[]): void,
  recents: Timer[]
}

const WorkspaceContext = createContext<WorkspaceContextContent>({} as WorkspaceContextContent);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }

  return context;
}

export const WorkspaceProvider: React.FC = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(ipcRenderer.sendSync('get-workspaces'));
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [recents, setRecents] = useState<Timer[]>(ipcRenderer.sendSync('get-recents'));
  const { setContent, show, hide } = useModal();
  const { shared: { buttons: { confirm, cancel }, namePlaceholder, newWorkspace, validation: { nameIsRequired, negativeNumbersAreNotAllowed, addValueToField }, hours, minutes, seconds } } = useLocalization()

  const workspaceValidation = useMemo(() => yup.object().shape({
    name: yup.string().required(nameIsRequired)
  }), [nameIsRequired]);

  const timerValidation = useMemo(() => yup.object().shape({
    name: yup.string().required(nameIsRequired),
    hours: yup.number().positive(negativeNumbersAreNotAllowed).test({
      message: addValueToField,
      test: function () {
        return !((!this.parent.seconds && !this.parent.minutes) && !this.parent[this.path]);
      }
    }),
    minutes: yup.number().positive(negativeNumbersAreNotAllowed).test({
      message: addValueToField,
      test: function () {
        return !((!this.parent.hours && !this.parent.seconds) && !this.parent[this.path]);
      }
    }),
    seconds: yup.number().positive(negativeNumbersAreNotAllowed).test({
      message: addValueToField,
      test: function () {
        return !((!this.parent.hours && !this.parent.minutes) && !this.parent[this.path]);
      }
    })
  }), [nameIsRequired, negativeNumbersAreNotAllowed, addValueToField]);

  useEffect(() => {
    ipcRenderer.on('update-recents', (_, value) => setRecents(value));
  }, []);

  const createWorkspace = useCallback(({ name }) => {
    hide();

    const workspace = {
      name: name,
      timers: []
    }

    const generatedWorkspace = ipcRenderer.sendSync('create-workspace', workspace) as Workspace;

    if (generatedWorkspace) {
      setWorkspaces((prevState) => [...prevState, generatedWorkspace]);
      setSelectedWorkspace(generatedWorkspace);
    }
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setWorkspaces(ipcRenderer.sendSync('get-workspaces'));
    setSelectedWorkspace(ipcRenderer.sendSync('delete-timer', id));
  }, []);

  const saveWorkspaces = useCallback(newWorkspaces => {
    ipcRenderer.send('save-workspaces', newWorkspaces);
    setWorkspaces(newWorkspaces);
  }, []);

  const deleteWorkspace = useCallback((id: string) => {
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
  }, [selectedWorkspace, workspaces])

  useEffect(() => {
    if (!selectedWorkspace) {
      setRecents(ipcRenderer.sendSync('get-recents'));
    }
  }, [selectedWorkspace]);

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
            <h2>{newWorkspace}</h2>
            <Input name="name" type="text" placeholder={namePlaceholder} />
            <ButtonsContainer>
              <Button type="button" onClick={hide}>{cancel}</Button>
              <Button type="submit" confirmButton>{confirm}</Button>
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
    setSelectedWorkspace(ipcRenderer.sendSync('edit-workspace', id, data) as Workspace);
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
            <Input name="name" type="text" placeholder={namePlaceholder} />
            <TimeInput>
              <Input name="hours" type="number" placeholder={hours} />:
              <Input name="minutes" type="number" placeholder={minutes} />:
              <Input name="seconds" type="number" placeholder={seconds} />
            </TimeInput>
            <ButtonsContainer>
              <Button type="button" onClick={hide}>{cancel}</Button>
              <Button confirmButton type="submit">{confirm}</Button>
            </ButtonsContainer>
          </Form>
        </Formik>
      )
    );

    show();
  }, [selectedWorkspace]);

  const editTimer = useCallback((id: string, data: Partial<Timer>) => {
    const updatedWorkspaces = ipcRenderer.sendSync('edit-timer', id, data) as Workspace[];

    setWorkspaces(updatedWorkspaces);
    setSelectedWorkspace(updatedWorkspaces.find(workspace => selectedWorkspace!.id === workspace.id) || null);
  }, []);

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
        createNewTimerModal,
        editTimer,
        saveWorkspaces,
        recents
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}