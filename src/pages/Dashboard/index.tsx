import React from 'react';
import { FiTrash2, FiEdit2, FiFolderPlus, FiSliders } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import TimerItem from '../../components/TimerItem';
import { Container, WorkspaceItem } from './styles';

const Dashboard: React.FC = () => {
  const { red, text } = useTheme();

  return (
    <Container>
      <aside>
        <h1>Workspaces</h1>
        <ul>
          <WorkspaceItem>
            Work
          </WorkspaceItem>
          <WorkspaceItem isActive={1}>
            Studies
            <FiTrash2 size={16} color={red} />
          </WorkspaceItem>
        </ul>

        <footer>
          <FiSliders size={20} color={text} />
          <FiFolderPlus size={20} color={text} />
        </footer>
      </aside>
      <main>
        <h1>
          Studies
          <FiEdit2 size={28} color={text} />
        </h1>
        <ul>
          <TimerItem name="React" time={900} />
          <TimerItem name="Java" time={1200} />
          <TimerItem name="C#" time={1200} />
          <TimerItem name="Python" time={600} />
        </ul>
      </main>
    </Container>
  );
}

export default Dashboard;