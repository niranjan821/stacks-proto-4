import { BlocksOrStacksType, PhaseType } from '../App';
import { Phase } from './Phase';

type StacksProps = {
	data: PhaseType,
	blocks: BlocksOrStacksType,
	index: number;
}

const Stacks = ({ blocks, data, index }: StacksProps) => {
	return (
		<Phase data={data} blocks={blocks} index={index} isStack={true} />
	)
}

export default Stacks