import { Dropdown, Loader, Button } from 'rsuite';
import { useEffect, useState } from 'react';
import settings from './settings';

const Schemes = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainSchemes, setMainSchemes] = useState([]);
    const [childSchemes, setChildSchemes] = useState([]);
    const [selectedMain, setSelectedMain] = useState(null);

    useEffect(() => {
        fetch(`${settings.workflowUrl}/schemes`)
            .then(response => response.json())
            .then(schemes => {
                setData(schemes);

                const mainOnly = schemes.filter(s =>
                    s.code.startsWith('main_approval') &&
                    !s.code.includes('_child_')
                );
                setMainSchemes(mainOnly);

                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedMain) {
            const children = data.filter(s =>
                s.code.startsWith(`${selectedMain.code}_child_`)
            );
            setChildSchemes(children);
        } else {
            setChildSchemes([]);
        }
    }, [selectedMain, data]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Loader size="md" content="Please wait, schemes are loading..." />
            </div>
        );
    }

    return (
        <div>
            <div style={{ margin: 50 }}>
                <h5>Select the main permit category:</h5>
                <Dropdown style={{padding: 20}} title={selectedMain?.code || 'Select Main Scheme'}>
                    {mainSchemes.map(main => (
                        <Dropdown.Item
                            key={main.code}
                            onClick={() => setSelectedMain(main)}
                        >
                            {main.code}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            </div>

            {selectedMain && (
                <>
                    <div style={{ margin: 50 }}>
                        <h5>Create a permit workflow with below sub permit categories:</h5>
                        <Dropdown style={{padding: 20}} title="Select Sub Permit Category">
                            {childSchemes.length > 0 ? (
                                childSchemes.map(child => (
                                    <Dropdown.Item
                                        key={child.code}
                                        onClick={() => props.onRowClick?.(child)}
                                    >
                                        {child.code}
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.Item disabled>No sub permit categories</Dropdown.Item>
                            )}
                        </Dropdown>
                    </div>

                    <div style={{ margin: 50 }}>
                        <h5>Or, prepare a workflow with this main permit template:</h5>
                        <Button style={{margin: 20}} appearance="primary" onClick={() => props.onRowClick?.(selectedMain)}>
                            Create workflow with {selectedMain.code}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Schemes;
