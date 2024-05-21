import { Draggable, Droppable } from "react-beautiful-dnd";
import { BlocksType, BlockType, ItemTypes, PhaseType } from "../App";
import { Block } from "./Block";

type PhaseProps = {
  data: PhaseType;
  index: number;
  blocks: BlocksType;
};

export const Phase = ({ data, index, blocks }: PhaseProps) => {
  return (
    <Draggable draggableId={data.id} index={index} key={data.id}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            className="phase"
          >
            <div className="phase-title">{data.name}</div>
            <Droppable
              droppableId={data.id}
              direction={"vertical"}
              type={ItemTypes.BLOCK}
            >
              {(provided) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="blocks"
                  >
                    {data.children.map((childId, index) => {
                      return (
                        <Block
                          data={blocks[childId]}
                          index={index}
                          key={childId}
                        />
                      );
                    })}
                    {provided.placeholder}
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
