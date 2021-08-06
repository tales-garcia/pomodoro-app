import { Form, Formik } from 'formik';
import React from 'react';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import Switch from '../../components/Switch';
import { useLocalization } from '../../hooks/localization';

import { Container } from './styles';

const Settings: React.FC = () => {
    const { messages: { settings: { appearance, clearRecents, displaySplashScreen, enableRecents, execute, initialize, openLastSessionWindows, recents, setLanguage, setTheme, settings, themes, selectALanguage, selectATheme } } } = useLocalization();

    return (
        <Container>
            <h1>{settings}</h1>

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
                        <h3>{recents}</h3>
                        <ul>
                            <li>
                                <p>{clearRecents}</p>
                                <Button confirmButton>{execute}</Button>
                            </li>
                            <li>
                                <p>{enableRecents}</p>
                                <Switch name="enableRecents" />
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h3>{initialize}</h3>
                        <ul>
                            <li>
                                <p>{openLastSessionWindows}</p>
                                <Switch name="openLastSession" />
                            </li>
                            <li>
                                <p>{displaySplashScreen}</p>
                                <Switch name="displaySplash" />
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h3>{appearance}</h3>
                        <ul>
                            <li>
                                <p>{setTheme}</p>
                                <span>
                                    <Dropdown name="setTheme" placeholder={selectATheme} options={Object.keys(themes).map(key => ({ value: key, label: (themes as any)[key] }))} />
                                </span>
                            </li>
                            <li>
                                <p>{setLanguage}</p>
                                <span>
                                    <Dropdown name="setLanguage" placeholder={selectALanguage} options={[{ label: 'English', value: 'en-US' }]} />
                                </span>
                            </li>
                        </ul>
                    </section>
                </Form>
            </Formik>
        </Container>
    );
}

export default Settings;