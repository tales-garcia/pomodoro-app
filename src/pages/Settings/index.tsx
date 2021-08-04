import { Form, Formik } from 'formik';
import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import Switch from '../../components/Switch';

import { Container } from './styles';

const Settings: React.FC = () => {
    return (
        <Container>
            <h1>Settings</h1>

            <Formik
                initialValues={{
                    enableRecents: false,
                    openLastSession: false,
                    displaySplash: false,
                    setTheme: '',
                    setLanguage: ''
                }}
                onSubmit={values => console.log(values)}
            >
                <Form>
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
                    <section>
                        <h3>Initialize</h3>
                        <ul>
                            <li>
                                <p>Open Last Session Windows</p>
                                <Switch name="openLastSession" />
                            </li>
                            <li>
                                <p>Display Splash Screen</p>
                                <Switch name="displaySplash" />
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h3>Initialize</h3>
                        <ul>
                            <li>
                                <p>Set Theme</p>
                                <Dropdown name="setTheme" placeholder="Select a Theme" options={[{ label: 'Dark', value: 'dark' }]} />
                            </li>
                            <li>
                                <p>Set Language</p>
                                <Dropdown name="setLanguage" placeholder="Select a Language" options={[{ label: 'English', value: 'en-US' }]} />
                            </li>
                        </ul>
                    </section>
                </Form>
            </Formik>
        </Container>
    );
}

export default Settings;