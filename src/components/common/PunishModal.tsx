import { useState } from 'react';
import { api } from '../../lib/api';
import { Modal, Button, Input } from './index';
import './PunishModal.css';
import type { Punishment } from '../../../../common';

export interface PunishModalProps {
  userUuid: string;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onPunish?: (punishment: Punishment) => void;
}

type DurationType = 'permanent' | 'custom';

export const PunishModal: React.FC<PunishModalProps> = ({
  userUuid,
  username,
  isOpen,
  onClose,
  onPunish,
}) => {
  const [durationType, setDurationType] = useState<DurationType>('permanent');
  const [durationHours, setDurationHours] = useState(24);
  const [durationDays, setDurationDays] = useState(1);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDurationMinutes = (): number | undefined => {
    if (durationType === 'permanent') {
      return undefined;
    }
    return durationDays * 24 * 60 + durationHours * 60;
  };

  const handlePunish = async () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const durationMinutes = calculateDurationMinutes();
      const punishment = await api.staff.punishments.issue({
        userUuid,
        reason,
        durationMinutes,
      });

      onPunish?.(punishment);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to issue punishment';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Punish ${username}`}>
      <div className="punish-modal__body">
        <div className="punish-modal__section">
          <label className="punish-modal__label">Duration</label>
          <div className="punish-modal__duration-type">
            <label className="punish-modal__radio-label">
              <input
                type="radio"
                name="durationType"
                value="permanent"
                checked={durationType === 'permanent'}
                onChange={(e) => setDurationType(e.target.value as DurationType)}
              />
              Permanent
            </label>
            <label className="punish-modal__radio-label">
              <input
                type="radio"
                name="durationType"
                value="custom"
                checked={durationType === 'custom'}
                onChange={(e) => setDurationType(e.target.value as DurationType)}
              />
              Custom Duration
            </label>
          </div>

          {durationType === 'custom' && (
            <div className="punish-modal__duration-inputs">
              <div className="punish-modal__duration-field">
                <label htmlFor="days">Days</label>
                <Input
                  id="days"
                  type="number"
                  min="0"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                  disabled={isLoading}
                />
              </div>
              <div className="punish-modal__duration-field">
                <label htmlFor="hours">Hours</label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Math.min(23, parseInt(e.target.value) || 0))}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>

        <div className="punish-modal__section">
          <label htmlFor="reason" className="punish-modal__label">
            Reason
          </label>
          <textarea
            id="reason"
            className="punish-modal__textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            placeholder="Enter punishment reason..."
            rows={4}
          />
        </div>

        {error && <p className="punish-modal__error">{error}</p>}

        <div className="punish-modal__footer">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handlePunish}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Confirm Punishment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
