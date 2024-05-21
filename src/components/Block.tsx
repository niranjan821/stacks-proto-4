import { Draggable } from "react-beautiful-dnd";
import { BlockType } from "../App";

type BlockProps = {
  data: BlockType;
  index: number;
};

export const Block = ({ data, index }: BlockProps) => {
  const isStack =
    data.fromIndex &&
    data.toIndex &&
    (data.fromIndex >= index || data.toIndex <= index);

  return (
    <Draggable
      draggableId={data.id}
      index={index}
      key={data.id}
      // isDragDisabled={!!isStack}
    >
      {(provided, snapshot) => {
        console.log(snapshot);
        return (
          <div
            className="block-wrapper"
            style={{ backgroundColor: isStack ? "GrayText" : "transparent" }}
          >
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              className="block"
            >
              {data.name}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
