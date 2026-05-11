import './App.css'
import { useState } from 'react';
import { LineGraph } from './components/graphs/LineGraph'
import type { LineGraphConfig } from './components/graphs/types';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Modal,
  Alert,
  ConfirmDialog,
} from './components/common';

function generateRealisticTemperature(dayIndex: number, totalDays: number): number {
  const yearProgress = dayIndex / totalDays;
  const warmTemp = 35; // Peak summer temperature
  const coolTemp = 17;  // Peak winter temperature
  const seasonalTemp = warmTemp + (coolTemp - warmTemp) * (1 - Math.cos(yearProgress * 2 * Math.PI)) / 2;
  const dailyVariation = Math.sin(dayIndex * 0.3) * 2;
  const noise = (Math.random() - 0.5) * 2;
  return Math.round((seasonalTemp + dailyVariation + noise) * 2) / 2;
}

const config: LineGraphConfig = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Temperature',
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    }
  },
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const labels = (() => {
  const list: string[] = [];
  months.forEach(month => {
    for (let i = 1; i <= 31; i++) {
      list.push(`${month} ${i}`);
    }
  });
  return list;
})();

const data = {
  labels,
  datasets: [
    {
      label: 'Temperature (°C)',
      data: labels.map((_, index) => {
        return generateRealisticTemperature(index, labels.length);
      }),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      yAxisID: 'y',
      tension: 0.4,
    },
  ],
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleConfirm = () => {
    setLoadingBtn(true);
    setTimeout(() => {
      setLoadingBtn(false);
      setShowConfirm(false);
    }, 1500);
  };

  return (
    <div className="app">
      <div className="app__container">
        <header className="app__header">
          <h1>Project Nimbus</h1>
          <p>Component Library & Design System</p>
        </header>

        <main className="app__main">
          {/* Buttons Section */}
          <Card elevated>
            <CardHeader>
              <h2>Buttons</h2>
            </CardHeader>
            <CardBody>
              <div className="component-grid">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading={loadingBtn}>
                  {loadingBtn ? 'Loading' : 'Click Me'}
                </Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </CardBody>
          </Card>

          {/* Inputs Section */}
          <Card elevated>
            <CardHeader>
              <h2>Form Inputs</h2>
            </CardHeader>
            <CardBody>
              <div className="form-grid">
                <Input
                  label="Standard Input"
                  placeholder="Enter text..."
                  fullWidth
                />
                <Input
                  label="Input with Helper"
                  placeholder="This has helper text"
                  helperText="This is a helpful hint"
                  fullWidth
                />
                <Input
                  label="Input with Error"
                  placeholder="This has an error"
                  error="This field is required"
                  fullWidth
                />
                <Input
                  label="Disabled Input"
                  placeholder="You cannot edit this"
                  disabled
                  fullWidth
                />
                <div>
                  <Input
                    label="Controlled Input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type something..."
                    fullWidth
                  />
                  {inputValue && <p className="info-text">Value: {inputValue}</p>}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Cards Section */}
          <Card elevated>
            <CardHeader>
              <h2>Card Components</h2>
            </CardHeader>
            <CardBody>
              <div className="component-grid">
                <Card>
                  <CardHeader>
                    <h3>Basic Card</h3>
                  </CardHeader>
                  <CardBody>
                    <p>This is a basic card with header and body.</p>
                  </CardBody>
                </Card>

                <Card elevated>
                  <CardHeader>
                    <h3>Elevated Card</h3>
                    <p>With shadow</p>
                  </CardHeader>
                  <CardBody>
                    <p>This card has an elevated appearance.</p>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h3>Card with Footer</h3>
                  </CardHeader>
                  <CardBody>
                    <p>This card demonstrates the footer component.</p>
                  </CardBody>
                  <CardFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardBody>
          </Card>

          {/* Modals Section */}
          <Card elevated>
            <CardHeader>
              <h2>Modals & Dialogs</h2>
            </CardHeader>
            <CardBody>
              <div className="component-grid">
                <Button onClick={() => setShowModal(true)} variant="secondary">
                  Open Modal
                </Button>
                <Button onClick={() => setShowAlert(true)} variant="secondary">
                  Show Alert
                </Button>
                <Button onClick={() => setShowConfirm(true)}>
                  Confirm Action
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Graph Section */}
          <Card elevated>
            <CardHeader>
              <h2>Data Visualization</h2>
            </CardHeader>
            <CardBody>
              <LineGraph data={data} config={config} />
            </CardBody>
          </Card>
        </main>
      </div>

      {/* Modal Examples */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
        }}
        title="Modal Example"
        confirmText="Got it"
        cancelText="Close"
        showCancel={true}
      >
        <p>
          This is an example modal component. It can contain any content you want,
          and you can customize the buttons and callbacks.
        </p>
        <br></br>
        <Input
          label="Enter something"
          placeholder="Type here..."
          fullWidth
        />
      </Modal>

      <Alert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Alert Dialog"
        actionText="Dismiss"
        variant="info"
      >
        <p>
          This is an alert dialog. It's typically used for important information
          or notifications that require user acknowledgment.
        </p>
      </Alert>

      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        title="Confirm Action"
        confirmText="Proceed"
        cancelText="Cancel"
        isDangerous={false}
      >
        <p>
          Are you sure you want to proceed with this action? This is a confirmation
          dialog that requires explicit user confirmation.
        </p>
      </ConfirmDialog>
    </div>
  )
}

export default App
