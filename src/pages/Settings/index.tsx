import React from 'react';
import Button from '../../components/Button';
import Switch from '../../components/Switch';

import { Container } from './styles';

const Settings: React.FC = () => {
    return (
        <Container>
            <h1>Settings</h1>

            <section>
                <h3>Recents</h3>
                <ul>
                    <li>
                        <p>Clear Recents</p>
                        <Button confirmButton>Execute</Button>
                    </li>
                    <li>
                        <p>Enable Recents</p>
                        <Switch name="enableRecents" />
                    </li>
                </ul>
            </section>
        </Container>
    );
}

export default Settings;