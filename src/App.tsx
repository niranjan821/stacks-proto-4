import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Phase } from "./components/Phase";
import "./styles.css";

export enum ItemTypes {
  PHASE = "PHASE",
  BLOCK = "BLOCK",
}

export type BlockType = {
  id: string;
  name: string;
  fromIndex?: number;
  toIndex?: number;
  depth?: number;
};

export type PhaseType = {
  id: string;
  name: string;
  children: string[];
};

export type BlocksType = { [key: string]: BlockType };
export type PhasesType = { [key: string]: PhaseType };

const blocksData: BlocksType = {
  "101": {
    id: "101",
    name: "Block 1.1: Initial Research",
  },
  "102": {
    id: "102",
    name: "Block 1.2: Requirements Gathering",
    depth: 1,
    fromIndex: 1,
    toIndex: 2,
  },
  "103": {
    id: "103",
    name: "Block 1.3: Feasibility Study",
    depth: 1,
    fromIndex: 1,
    toIndex: 2,
  },
  "201": {
    id: "201",
    name: "Block 2.1: System Design",
  },
  "202": {
    id: "202",
    name: "Block 2.2: Database Design",
  },
  "203": {
    id: "203",
    name: "Block 2.3: UI/UX Design",
  },
  "301": {
    id: "301",
    name: "Block 3.1: Frontend Development",
  },
  "302": {
    id: "302",
    name: "Block 3.2: Backend Development",
  },
  "303": {
    id: "303",
    name: "Block 3.3: Integration",
  },
  "401": {
    id: "401",
    name: "Block 4.1: Unit Testing",
  },
  "402": {
    id: "402",
    name: "Block 4.2: Integration Testing",
  },
  "403": {
    id: "403",
    name: "Block 4.3: System Testing",
  },
  "501": {
    id: "501",
    name: "Block 5.1: Staging Deployment",
  },
  "502": {
    id: "502",
    name: "Block 5.2: Production Deployment",
  },
  "601": {
    id: "601",
    name: "Block 6.1: Bug Fixing",
  },
  "602": {
    id: "602",
    name: "Block 6.2: Performance Optimization",
  },
};

const phasesData = {
  "1": {
    id: "1",
    name: "Phase 1: Planning",
    children: ["101", "102", "103", "303"],
  },
  "2": {
    id: "2",
    name: "Phase 2: Design",
    children: ["201", "202", "203"],
  },
  "3": {
    id: "3",
    name: "Phase 3: Development",
    children: ["301", "302"],
  },
  "4": {
    id: "4",
    name: "Phase 4: Testing",
    children: ["401", "402", "403"],
  },
  "5": {
    id: "5",
    name: "Phase 5: Deployment",
    children: ["501", "502"],
  },
  "6": {
    id: "6",
    name: "Phase 6: Maintenance",
    children: ["601", "602"],
  },
};

const rootData = {
  id: "0",
  name: "Project",
  children: ["1", "2", "3", "4", "5", "6"],
};

export default function App() {
  const [root, setRoot] = useState(rootData);
  const [phases, setPhases] = useState<PhasesType>(phasesData);
  const [blocks, setBlocks] = useState<BlocksType>(blocksData);

  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable
        direction="horizontal"
        type={ItemTypes.PHASE}
        droppableId="PHASE-DROPZONE"
      >
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="App"
            >
              {root.children.map((childId, index) => {
                return (
                  <Phase
                    data={phases[childId]}
                    index={index}
                    blocks={blocks}
                    key={childId}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}
