import React from 'react';
import { FiTrash2, FiEdit2, FiFolderPlus, FiSliders, FiEdit, FiPlay, FiTrash } from 'react-icons/fi';
import { useTheme } from 'styled-components';
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
          <li>
            <h2>15<span>:</span>00</h2>
            <h3>React</h3>
            <footer>
              <FiPlay size={20} color={text} />
              <FiEdit size={20} color={text} />
              <FiTrash size={20} color={red} />
            </footer>
          </li>
          <li>
            <h2>20<span>:</span>00</h2>
            <h3>Java</h3>
            <footer>
              <FiPlay size={20} color={text} />
              <FiEdit size={20} color={text} />
              <FiTrash size={20} color={red} />
            </footer>
          </li>
          <li>
            <h2>20<span>:</span>00</h2>
            <h3>C#</h3>
            <footer>
              <FiPlay size={20} color={text} />
              <FiEdit size={20} color={text} />
              <FiTrash size={20} color={red} />
            </footer>
          </li>
          <li>
            <h2>10<span>:</span>00</h2>
            <h3>Python</h3>
            <footer>
              <FiPlay size={20} color={text} />
              <FiEdit size={20} color={text} />
              <FiTrash size={20} color={red} />
            </footer>
          </li>
        </ul>
      </main>
    </Container>
  );
}

export default Dashboard;