interface NotificationProps {
  success?: string;
  error?: string;
}

const Notification = ({ success, error }: NotificationProps) => {
  return (
    <div class="ui grid">
      <div class="four wide column"></div>
      <div class="eight wide column">
        {!!success && (
          <div class="ui success message">
            <p>{success}</p>
          </div>
        )}
        {!!error && (
          <div class="ui error message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
