import { TimelineBlock } from './components/TimelineBlock/TimelineBlock';
import { data } from './data';
import './styles/global.scss';

export default function App() {
  return (
    <main className="container">
      <TimelineBlock ranges={data} />
    </main>
  );
}
