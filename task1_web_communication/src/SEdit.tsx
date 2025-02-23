import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

type ModalProps = {
  newButtonName: string;
  setNewButtonName: Dispatch<SetStateAction<string>>;
  handleSaveButton: (data: { name: string; plan_space: string; speed: number; acceleration: number; wait: number; id: string }) => void;
  closeSedit: () => void;
  data: { name: string; plan_space: string; speed: number; acceleration: number; wait: number; id: string } | undefined;
};

const SEdit: React.FC<ModalProps> = ({
  newButtonName,
  setNewButtonName,
  handleSaveButton,
  data,
  closeSedit,
}) => {
  const [speed, setSpeed] = useState<number | "">("");
  const [acceleration, setAcceleration] = useState<number | "">("");
  const [wait, setWait] = useState<number | "">("");
  const [selectedPlan, setSelectedPlan] = useState<"Cartesian" | "Joints">("Cartesian");
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setNewButtonName(data.name || "");
      setSelectedPlan(data.plan_space as "Cartesian" | "Joints" || "Cartesian");
      setSpeed(data.speed || "");
      setAcceleration(data.acceleration || "");
      setWait(data.wait || "");
    }
  }, [data, setNewButtonName]);

  const validateForm = () => {
    if (!newButtonName.trim()) {
      setError("Name is required.");
      return false;
    }
    if (/\s/.test(newButtonName)) {
      setError("Name cannot contain spaces.");
      return false;
    }
    if (speed !== "" && (speed < 0.1 || speed > 1)) {
      setError("Speed must be a number between 0.1 and 1, if provided.");
      return false;
    }
    if (acceleration !== "" && (acceleration < 0.1 || acceleration > 1)) {
      setError("Acceleration must be a number between 0.1 and 1, if provided.");
      return false;
    }
    if (wait !== "" && wait < 0) {
      setError("Wait time must be a non-negative number.");
      return false;
    }
    setError("");
    return true;
  };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     handleSaveButton({
  //       name: newButtonName,
  //       plan_space: selectedPlan,
  //       speed: speed === "" ? 0.1 : Number(speed),
  //       acceleration: acceleration === "" ? 0.1 : Number(acceleration),
  //       wait: wait === "" ? 0 : Number(wait),
  //       id: data?.id || "",
  //     });
  //     resetForm();
  //     closeSedit();
  //   }
  // };
  const handleSubmit = async () => {
    if (validateForm()) {
      const updatedData = {
        name: newButtonName,
        speed:speed,
        acceleration:acceleration,
        wait:wait,
        plan_space:selectedPlan,
        id: data?.id || "",
      };

      try {
        const response = await fetch(`http://localhost:5000/path/editPath`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          console.log("Data updated successfully!");
          resetForm();
          closeSedit();
        } else {
          const errorText = await response.text();
          setError(`Error: ${errorText}`);
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setNewButtonName("");
    setSpeed("");
    setAcceleration("");
    setWait("");
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    closeSedit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-semibold mb-4">Edit Path</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={newButtonName}
              onChange={(e) => setNewButtonName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Plan Space:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="plan_space"
                  value="Cartesian"
                  checked={selectedPlan === "Cartesian"}
                  onChange={() => setSelectedPlan("Cartesian")}
                  className="mr-2"
                />
                Cartesian
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="plan_space"
                  value="Joints"
                  checked={selectedPlan === "Joints"}
                  onChange={() => setSelectedPlan("Joints")}
                  className="mr-2"
                />
                Joints
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="speed" className="block text-sm font-medium mb-2">
              Velocity (0.1 - 1)
            </label>
            <input
              id="speed"
              type="number"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter Velocity"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="acceleration" className="block text-sm font-medium mb-2">
              Acceleration (0.1 - 1)
            </label>
            <input
              id="acceleration"
              type="number"
              step="0.1"
              value={acceleration}
              onChange={(e) => setAcceleration(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter acceleration"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="wait" className="block text-sm font-medium mb-2">
              Wait Time
            </label>
            <input
              id="wait"
              type="number"
              value={wait}
              onChange={(e) => setWait(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Enter wait time"
            />
          </div>
        </form>
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
          >
            Submit
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEdit;