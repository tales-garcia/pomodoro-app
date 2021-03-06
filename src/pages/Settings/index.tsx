import { ipcRenderer } from 'electron';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import AutoSave from '../../components/AutoSave';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import Switch from '../../components/Switch';
import { useLocalization } from '../../hooks/localization';
import { useSettings } from '../../hooks/settings';

import { Container } from './styles';

const Settings: React.FC = () => {
    const { settings: { appearance, clearRecents, displaySplashScreen, enableRecents, execute, initialize, openLastSessionWindows, recents, setLanguage, setTheme, settings, themes, selectALanguage, selectATheme } } = useLocalization();
    const settingsObject = useSettings();

    const availableLocales = useMemo(() => ipcRenderer.sendSync('get-available-locales'), []);

    const handleSubmit = useCallback(values => ipcRenderer.send('set-settings', values), []);

    return (
        <Container>
            <h1>{settings}</h1>

            <Formik
                initialValues={settingsObject}
                onSubmit={handleSubmit}
            >
                <Form>
                    <AutoSave />
                    <section>
                        <h3>{recents}</h3>
                        <ul>
                            <li>
                                <p>{clearRecents}</p>
                                <Button type="button" confirmButton>{execute}</Button>
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
                                    <Dropdown name="theme" placeholder={selectATheme} options={Object.keys(themes).map(key => ({ value: key, label: (themes as any)[key] }))} />
                                </span>
                            </li>
                            <li>
                                <p>{setLanguage}</p>
                                <span>
                                    <Dropdown name="language" placeholder={selectALanguage} options={Object.keys(availableLocales).map(key => ({ value: key, label: (availableLocales[key]) }))} />
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