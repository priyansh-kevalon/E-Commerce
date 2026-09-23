import Button from '../common/Button.jsx';

export default function ModalFooter({ formId, submitting, submitLabel, onCancel, cancelLabel = 'Cancel' }) {
  return (
    <>
      <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
        {cancelLabel}
      </Button>
      <Button type="submit" form={formId} disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </Button>
    </>
  );
}