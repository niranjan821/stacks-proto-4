import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  BlocksOrStacksType,
  BlockOrStackType,
  ItemTypes,
  PhaseType,
} from "../App";
import { Block } from "./Block";
import Stacks from "./Stacks";

type PhaseProps = {
  data: PhaseType;
  index: number;
  blocks: BlocksOrStacksType;
  isStack?: boolean;
};

export const Phase = ({ data, index, blocks, isStack = false }: PhaseProps) => {
  return (
    <Draggable draggableId={data.id} index={index} key={data.id}>
      {(provided, dragSnapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            className={`phase ${isStack && 'stack'}`}
            style={{
              backgroundColor: isStack ? "GrayText" : "aqua",
              ...provided.draggableProps.style,
            }}
            data-id={data.id}
          >
            <div className="phase-title">{data.name}</div>
            <Droppable
              droppableId={data.id}
              direction={"vertical"}
              type={isStack ? "STACK" : ItemTypes.BLOCK}
              isCombineEnabled={!isStack}
            >
              {(provided) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="blocks"
                  >
                    {data.children.map((childId, index) => {
                      const block = blocks[childId];
                      const type = block.type;
                      return type === "STACK" ? (
                        <Stacks data={block as any} blocks={blocks} index={index} key={block.id} />
                      ) : (
                        <Block data={block} index={index} key={childId} isStack={isStack} parentId={data.id} />
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
