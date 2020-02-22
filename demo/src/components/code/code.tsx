import React from 'react';
import { Prism } from '..';
import './code.scss';

interface Props {
  children: string;
}

export default function Code({ children }: Props): JSX.Element {
  return (
    <section className="code">
      <h3>Code</h3>
      <Prism lang="jsx">{children.trim()}</Prism>
    </section>
  );
}
