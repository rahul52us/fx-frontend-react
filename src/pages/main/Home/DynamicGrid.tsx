import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface Widget {
  id: string;
  content: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  fontFamily: string;
  margin: number;
  padding: number;
}

const DynamicGrid = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    const savedWidgets = JSON.parse(localStorage.getItem("widgets") || "[]");
    setWidgets(savedWidgets);
  }, []);

  const addWidget = () => {
    const newWidget: Widget = {
      id: Math.random().toString(),
      content: "New Widget",
      fontSize: 16,
      fontColor: "#000000",
      backgroundColor: "#f0f0f0",
      fontFamily: "Arial",
      margin: 10,
      padding: 10,
    };
    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
    saveLayoutAndWidgets();
  };

  const deleteWidget = (id: string) => {
    setWidgets((prevWidgets) => prevWidgets.filter((widget) => widget.id !== id));
    saveLayoutAndWidgets();
  };

  const onContentChange = (id: string, content: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, content } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const onFontSizeChange = (id: string, value: number) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, fontSize: value } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const onFontColorChange = (id: string, value: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, fontColor: value } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const onBackgroundColorChange = (id: string, value: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, backgroundColor: value } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const onFontFamilyChange = (id: string, value: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, fontFamily: value } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const onMarginChange = (id: string, value: number) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, margin: value } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const onPaddingChange = (id: string, value: number) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, padding: value } : widget
      )
    );
    saveLayoutAndWidgets();
  };

  const saveLayoutAndWidgets = () => {
    localStorage.setItem("widgets", JSON.stringify(widgets));
  };

  return (
    <Box p={4}>
      <Button colorScheme="teal" onClick={addWidget} mb={4}>
        Add Widget
      </Button>

      <Box display="flex" flexWrap="wrap" gap={4}>
        {widgets.map((widget) => (
          <ResizableBox
            key={widget.id}
            width={200}
            height={200}
            minConstraints={[100, 100]}
            maxConstraints={[300, 300]}
            axis="both"
          >
            <Box
              p={widget.padding}
              m={widget.margin}
              backgroundColor={widget.backgroundColor}
              borderRadius="md"
              boxShadow="md"
              style={{
                fontSize: `${widget.fontSize}px`,
                color: widget.fontColor,
                fontFamily: widget.fontFamily,
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <Input
                value={widget.content}
                onChange={(e) => onContentChange(widget.id, e.target.value)}
                size="sm"
                mb={2}
              />
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={() => deleteWidget(widget.id)}
                mt={2}
              >
                Delete
              </Button>
            </Box>

            <Box mt={4} p={2} style={{ fontSize: "12px" }}>
              <Slider
                value={widget.fontSize}
                onChange={(value) => onFontSizeChange(widget.id, value)}
                min={8}
                max={30}
                mb={2}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>

              <Input
                type="color"
                value={widget.fontColor}
                onChange={(e) => onFontColorChange(widget.id, e.target.value)}
                size="sm"
                mb={2}
              />
              <Input
                type="color"
                value={widget.backgroundColor}
                onChange={(e) => onBackgroundColorChange(widget.id, e.target.value)}
                size="sm"
                mb={2}
              />
              <Select
                value={widget.fontFamily}
                onChange={(e) => onFontFamilyChange(widget.id, e.target.value)}
                size="sm"
                mb={2}
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </Select>
              <Slider
                value={widget.margin}
                onChange={(value) => onMarginChange(widget.id, value)}
                min={0}
                max={50}
                mb={2}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Slider
                value={widget.padding}
                onChange={(value) => onPaddingChange(widget.id, value)}
                min={0}
                max={50}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </ResizableBox>
        ))}
      </Box>
    </Box>
  );
};

export default DynamicGrid;
