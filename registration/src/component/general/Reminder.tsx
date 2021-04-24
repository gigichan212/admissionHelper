export default function ReminderComponent(props: {
  title: string;
  info: string;
}) {
  return (
    <div className="reminder">
      {props.title}
      {props.info}
    </div>
  );
}
