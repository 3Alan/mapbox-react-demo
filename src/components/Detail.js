import { Card } from 'antd';

function Cafe(props) {
  const { detail } = props;
  return (
    <Card style={{ width: '100%' }}>
      <p>Trading name: {detail['Trading name']}</p>
      <p>Street address: {detail['Street address']}</p>
      <p>Industry (ANZSIC4) description: {detail['Industry (ANZSIC4) description']}</p>
      <p>Seating type: {detail['Seating type']}</p>
      <p>Number of seats: {detail['Number of seats']}</p>
    </Card>
  );
}
function Landmarks({ detail }) {
  return (
    <Card style={{ width: '100%' }}>
      <p>Theme: {detail['Theme']}</p>
      <p>Sub Theme: {detail['Sub Theme']}</p>
      <p>Feature Name: {detail['Feature Name']}</p>
    </Card>
  );
}
function Live({ detail }) {
  return (
    <Card style={{ width: '100%' }}>
      <p>Venue name: {detail['venue_name']}</p>
      <p>Venue address: {detail['venue_address']}</p>
      <p>Space type: {detail['space_type']}</p>
      <p>
        Website:{' '}
        <a target="_blank" href={detail['website']}>
          {detail['website']}
        </a>
      </p>
    </Card>
  );
}

export default function Detail(props) {
  const { type, detail } = props;
  console.log(props);
  if (type === 'cafe') {
    return <Cafe detail={detail} />;
  } else if (type === 'live') {
    return <Live detail={detail} />;
  } else {
    return <Landmarks detail={detail} />;
  }
}
