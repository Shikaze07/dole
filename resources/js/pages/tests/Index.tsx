import React from 'react';

const Index = ({ tests }: any) => {
    return (
        <div>
            {tests.map((test: any) => {
                return <div key={test.id}>{test.description}</div>;
            })}
        </div>
    );
};

export default Index;
