import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { cloneDeep } from "lodash";
import { Phase } from "./components/Phase";
import "./styles.css";

export enum ItemTypes {
  PHASE = "PHASE",
  BLOCK = "BLOCK",
}

export type BlockOrStackType = {
  id: string;
  name: string;
  children?: string[];
  type?: "STACK" | "BLOCK";
};

export type PhaseType = {
  id: string;
  name: string;
  children: string[];
  type: "PHASE";
};

export type BlocksOrStacksType = { [key: string]: BlockOrStackType };
export type PhasesType = { [key: string]: PhaseType };

const blocksData: BlocksOrStacksType = {
  "101": {
    id: "101",
    name: "Block 1.1: Initial Research",
  },
  "102": {
    id: "102",
    name: "Block 1.2: Requirements Gathering",
  },
  "103": {
    id: "103",
    name: "Block 1.3: Feasibility Study",
  },
  "201": {
    id: "201",
    name: "Block 2.1: System Design",
  },
  "202": {
    id: "202",
    name: "Block 2.2: Database Design",
    children: ["403", "303"],
    type: "STACK",
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

const phasesData: PhasesType = {
  "1": {
    id: "1",
    name: "Phase 1: Planning",
    children: ["101", "102", "103"],
    type: "PHASE",
  },
  "2": {
    id: "2",
    name: "Phase 2: Design",
    children: ["201", "202", "203"],
    type: "PHASE",
  },
  "3": {
    id: "3",
    name: "Phase 3: Development",
    children: ["301", "302"],
    type: "PHASE",
  },
  "4": {
    id: "4",
    name: "Phase 4: Testing",
    children: ["401", "402"],
    type: "PHASE",
  },
  "5": {
    id: "5",
    name: "Phase 5: Deployment",
    children: ["501", "502"],
    type: "PHASE",
  },
  "6": {
    id: "6",
    name: "Phase 6: Maintenance",
    children: ["601", "602"],
    type: "PHASE",
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
  const [blocks, setBlocks] = useState<BlocksOrStacksType>(blocksData);

  const handleDragEnd = ({
    draggableId,
    destination,
    reason,
    source,
    type,
    combine,
  }: DropResult) => {
    document.querySelector(".App")?.removeAttribute("data-hide");
    if ((!destination && !combine) || reason === "CANCEL") {
      return;
    }
    // in case the user is trying to drop at the same position, cancel the reorder
    if (
      destination?.droppableId === source.droppableId &&
      source.index === destination?.index
    ) {
      return;
    }
    // Reorder blocks
    if ((type === ItemTypes.BLOCK || type === "STACK")) {
      // Create stack
      if (combine) {
        const targetDroppable = phases[combine.droppableId];

        const sourceDroppable = phases[source.droppableId];
        const targetIndex = targetDroppable.children.indexOf(combine.draggableId);
        if (targetIndex !== -1) {
          const newStack: BlockOrStackType = {
            id: Math.random().toString(),
            name: 'Stack',
            children: [draggableId, combine.draggableId],
            type: 'STACK'
          }

          targetDroppable.children.splice(targetIndex, 1, newStack.id);
          if (targetDroppable.id !== sourceDroppable.id) {
            sourceDroppable.children.splice(source.index, 1);
          } else {
            targetDroppable.children.splice(source.index, 1);
          }
          blocks[newStack.id] = newStack;

          setBlocks({...blocks});
          setPhases({...phases});
        }
      } else if (destination) {
        // Handle insertion and deletion of block in stack
        if (destination.droppableId.includes("droppable")) {
          const [_, toPhaseId, toIndex] = destination.droppableId.split("-");
          const fromPhase =
            phases[source.droppableId] || blocks[source.droppableId];
          const toPhase = phases[toPhaseId] || blocks[toPhaseId];
          fromPhase.children.splice(source.index, 1);
          toPhase.children.splice(parseInt(toIndex), 0, draggableId);
          blocks[toPhase.id] = toPhase as any;
          phases[fromPhase.id] = fromPhase;
          setBlocks({ ...blocks });
          setPhases({ ...phases });
        } else {
          // Block reorder
          if (type === 'STACK') {
            const fromStack = blocks[source.droppableId];

            fromStack.children?.splice(source.index, 1);
            fromStack.children?.splice(destination.index, 0, draggableId);
            blocks[fromStack.id] = fromStack;
            setBlocks({...blocks});
          } else {
            const clonedPhases = cloneDeep(phases);
    
            const toPhaseId = destination.droppableId;
            const toPhase = clonedPhases[toPhaseId];
            const toIndex = destination.index;
    
            const fromPhaseId = source.droppableId;
            const fromPhase = clonedPhases[source.droppableId];
            const fromIndex = source.index;
    
            fromPhase.children.splice(fromIndex, 1);
            toPhase.children.splice(toIndex, 0, draggableId);
    
            clonedPhases[fromPhaseId] = fromPhase;
            clonedPhases[toPhaseId] = toPhase;
    
            setPhases(clonedPhases);
          }
        }
      }
    } else if (destination) {
      // Reorder phases
      const clonedRoot = cloneDeep(root);
      let toIndex = destination.index;
      let fromIndex = source.index;

      clonedRoot.children.splice(fromIndex, 1);
      clonedRoot.children.splice(toIndex, 0, draggableId);

      setRoot(clonedRoot);
    }
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onBeforeCapture={({ draggableId }) => {
        const draggedBlockItem = blocks[draggableId];
        if (draggedBlockItem) {
          const attr = draggedBlockItem.type === 'STACK' ? 'stack' : 'phase';
          document.querySelector('.App')?.setAttribute('data-hide', attr);
        }
      }}
    >
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
