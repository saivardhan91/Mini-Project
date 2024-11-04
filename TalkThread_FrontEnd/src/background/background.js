import React, { useEffect } from 'react';

const BackgroundComponent = ({ children, isBackgroundVisible }) => {
    useEffect(() => {
        if (isBackgroundVisible) {
            document.body.style.backgroundImage = 'linear-gradient(90deg, rgba(129,116,185,1) 18%, rgba(165,165,206,1) 49%, rgba(139,165,209,1) 74%)';
            document.body.style.backgroundSize = 'cover'; 
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed'; 
            document.body.style.display= 'flex'; 
            document.body.style.justifyContent= 'center'; 

        } else {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.style.display= ''; 
            document.body.style.justifyContent= ''; 
        }

        // Cleanup on component unmount
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.style.display= ''; 
            document.body.style.justifyContent= ''; 
        };
    }, [isBackgroundVisible]);

    return <>{children}</>;
};

export default BackgroundComponent;
