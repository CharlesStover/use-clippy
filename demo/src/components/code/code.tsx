import React, { ChangeEvent } from 'react';
import { Prism } from '..';
import './code.scss';

interface Props {
  children: string;
}

export default function Code({ children }: Props): JSX.Element {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleExpandedChange = React.useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setExpanded(e.currentTarget.checked);
    },
    [],
  );

  return (
    <div className="code">
      <label>
        <input
          checked={expanded}
          onChange={handleExpandedChange}
          type="checkbox"
        />{' '}
        Show code
      </label>
      {expanded && <Prism lang="jsx">{children.trim()}</Prism>}
    </div>
  );
}
