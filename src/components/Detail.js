import { Card } from 'antd';

function Cafe(props) {
  const { detail } = props;
  return (
    <Card style={{ width: '100%' }}>
      <p style={{ color: '#1d4ed8' }}>{detail['Trading name']}</p>
      <p>
        <strong>Street address:</strong> {detail['Street address']}
      </p>
      <p>
        <strong>Industry (ANZSIC4) description:</strong> {detail['Industry (ANZSIC4) description']}
      </p>
      <p>
        <strong>Seating type: </strong>
        {detail['Seating type']}
      </p>
      <p>
        <strong>Number of seats:</strong> {detail['Number of seats']}
      </p>
    </Card>
  );
}
function Landmarks({ detail }) {
  return (
    <Card style={{ width: '100%' }}>
      <p style={{ color: '#1d4ed8' }}>{detail['Theme']}</p>
      <p>
        <strong>Sub Theme:</strong> {detail['Sub Theme']}
      </p>
      <p>
        <strong>Feature Name:</strong> {detail['Feature Name']}
      </p>
    </Card>
  );
}
function Live({ detail }) {
  return (
    <Card style={{ width: '100%' }}>
      <p style={{ color: '#1d4ed8' }}>{detail['venue_name']}</p>
      <p>
        <strong>Venue address:</strong> {detail['venue_address']}
      </p>
      <p>
        <strong>Space type:</strong> {detail['space_type']}
      </p>
      <p>
        <strong>Website:</strong>
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
