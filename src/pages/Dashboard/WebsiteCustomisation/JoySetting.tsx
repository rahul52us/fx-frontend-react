import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { observer } from 'mobx-react-lite';
import { Box, Button, useColorMode } from '@chakra-ui/react';

interface TourState {
  run: boolean;
  stepIndex: number;
}

const WebsiteBuilder: React.FC = observer(() => {
  const { colorMode, toggleColorMode } = useColorMode();

  // Define the steps for the Joyride tour
  const steps: Step[] = [
    {
      target: '.add-section-button',
      content: 'Click here to add a new section to your website!',
      disableBeacon: true,
    },
    {
      target: '.toggle-theme-button',
      content: 'Use this button to switch between light and dark modes.',
    },
    {
      target: '.color-settings-drawer',
      content: 'Customize your color settings here!',
    },
    {
      target: '.save-button',
      content: 'Don’t forget to save your changes when you’re done.',
    },
  ];

  // Initialize state for managing the tour status and step index
  const [tour, setTour] = useState<TourState>({
    run: true,
    stepIndex: 0,
  });

  // Callback function to handle tour status changes
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setTour({ run: false, stepIndex: 0 });
    } else if (type === 'step:after' && action === 'next') {
      setTour((prev) => ({ ...prev, stepIndex: index + 1 }));
    } else if (type === 'step:after' && action === 'prev') {
      setTour((prev) => ({ ...prev, stepIndex: index - 1 }));
    }
  };

  return (
    <Box padding="4">
      {/* Joyride component */}
      <Joyride
        steps={steps}
        run={tour.run}
        stepIndex={tour.stepIndex}
        continuous
        showSkipButton
        scrollToFirstStep
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#3182CE', // Adjust color to fit your theme
            zIndex: 1000,
          },
        }}
      />

      {/* Sample buttons and sections for demonstration */}
      <Button className="add-section-button" colorScheme="blue" mb="4">
        Add Section
      </Button>

      <Button className="toggle-theme-button" onClick={toggleColorMode} mb="4">
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>

      <Box className="color-settings-drawer" mb="4" border="1px solid" padding="4">
        <p>Color Settings Drawer (example)</p>
      </Box>

      <Button className="save-button" colorScheme="green">
        Save Changes
      </Button>
    </Box>
  );
});

export default WebsiteBuilder;
