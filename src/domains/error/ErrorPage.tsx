import { showReportDialog } from '@sentry/react';

import { Button, Navbar, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphonesAlt, faBolt, faCompactDisc, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/* ToDo: Translate this whole page? What about i18n lib errors? */

const ErrorPage = ({ error, eventId, resetError }: { error?: any; eventId?: string; resetError?: () => void }) => {
  const reloadPage = () => {
    window.location.reload();
    return false;
  };

  const resetOrGoHome = () => {
    try {
      if (resetError) {
        resetError();
      }
    } catch (error) {
      // eslint-disable-next-line react-compiler/react-compiler
      window.location.href = '/';
      window.location.reload();
    }
  };

  let username;
  try {
    username = JSON.parse(localStorage.getItem('user'))?.name;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to fetch username from localStorage', error);
  }

  const fillReport = () => {
    showReportDialog({
      eventId,
      // labelName: `${t('username')} (last.fm)`,
      // lang: i18n.language,
      user: {
        name: username,
      },
      title: 'Crash report',
      subtitle: 'The developer has been notified.',
      subtitle2: "If you'd like to help, tell us what happened below. Thanks in advance!",
      onClose: resetOrGoHome,
    });
  };

  return (
    <>
      <Navbar color="dark" dark expand="md" id="ows-Navigation">
        <a href="/">
          <NavbarBrand tag="div" className="flex-grow-1 flex-md-grow-0">
            <FontAwesomeIcon icon={faHeadphonesAlt} />
            Open Scrobbler
          </NavbarBrand>
        </a>
      </Navbar>

      <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faBolt} transform="shrink-8 up-3 right-4 rotate-30" mask={faCompactDisc} size="4x" />
          <h2 className="mt-2 mb-0 h1 text-white">Sorry, there was a problem!</h2>
          <p>An unexpected problem occurred. It&apos;s not your fault.</p>
        </div>
        <h3 className="h4">What now?</h3>
        <p>
          In most cases you will be able to continue using the application by clicking the <em>Go back</em> button. If
          that doesn&apos;t work,{' '}
          <button className="btn btn-link p-0" style={{ top: '-2px' }} onClick={reloadPage}>
            please refresh the page
          </button>
          .
        </p>
        <p>
          It would be very helpful to{' '}
          <button className="btn btn-link p-0" style={{ top: '-2px' }} onClick={fillReport}>
            send a crash report
          </button>{' '}
          if you can spare a few minutes :)
        </p>

        <details className="mb-2">
          <summary>Technical details</summary>
          <div className="card p-3 my-2 ms-3">
            <code>{error && error.toString()}</code>
            <p className="pt-3">
              If you understand what is going on here, your feedback will be very helpful!
              <br />
              Fixes would be well received as well :)
            </p>
            <a
              className="d-block"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/elamperti/OpenWebScrobbler/blob/main/CONTRIBUTING.md#fixing-bugs"
            >
              How to contribute →
            </a>
          </div>
        </details>

        <details className="mb-4">
          <summary>I need more help!</summary>
          <p className="py-2 px-3">
            This project is maintained by one developer in his spare time. You can ask for help{' '}
            <strong>politely</strong> in{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/SEDp6Zy">
              our Discord server
            </a>
            . Be patient and someone will help you!
          </p>
        </details>

        <div className="mt-4 d-flex justify-content-center align-items-center">
          <Button className="mx-2" color="success" onClick={resetError}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Return to the scrobbler
          </Button>
          <Button className="mx-2" color="info" onClick={fillReport}>
            Tell us what happened
            <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
