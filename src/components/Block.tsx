import { Draggable, Droppable } from "react-beautiful-dnd";
import { BlockOrStackType, ItemTypes } from "../App";

type BlockProps = {
  data: BlockOrStackType;
  index: number;
  isStack?: boolean
  parentId: string;
};

export const Block = ({ data, index, isStack = false, parentId }: BlockProps) => {
  return (
    <Draggable
      draggableId={data.id}
      index={index}
      key={data.id}
      // isDragDisabled={!!isStack}
    >
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            className="block-wrapper"
          >
            <div className="block">{data.name}</div>
            <Droppable
              droppableId={`droppable-${parentId}-${index+1}`}
              direction="horizontal"
              type={!isStack ? 'STACK' : ItemTypes.BLOCK}
            >
              {(provided, snapshot) => {
                return (
                  <div
                    className={`droppable ${isStack ? "stack-droppable" : 'phase-droppable'}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ textAlign: 'center', backgroundColor: snapshot.isDraggingOver ? 'green' : 'transparent' }}
                  >
                    droppable
                  </div>
                );
              }}
            </Droppable>
          </div>
        );
      }}
    </Draggable>
  );
};
