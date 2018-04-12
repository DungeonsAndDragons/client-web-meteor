import React from 'react';

export function isCharacterEditable(character) {
    return character.ownerID === Meteor.userId();
}

export function requireLogin(WrappedComponent) {
    return class extends React.Component {

        checkLogin = () => {
            if (!Meteor.userId())
                Meteor.logout(() => {
                    Session.set('redirectAfterLogin', this.props.location);
                    this.props.router.push('/login');
                });
            else
                Session.set('redirectAfterLogin', undefined);
        };

        componentWillMount() {
            this.checkLogin();
        }

        componentDidUpdate() {
            this.checkLogin();
        }

        render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            if (!Meteor.userId())
                return <div>Unauthenticated! Redirecting ...</div>;
            else
                return <WrappedComponent {...this.props} />;
        }
    };
}