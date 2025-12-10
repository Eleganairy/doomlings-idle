import { COLORS } from "../constants/colors.constants";

/**
 *
 * @param isActive What is the active condition for the button
 * @param isDisabled What is the disabled condition for the button
 * @returns The base color for the button based on its state
 */
export const getButtonBaseStateColors = (
  isActive: boolean,
  isDisabled?: boolean
) => {
  if (isActive) return COLORS.BUTTON_ACTIVE;
  if (isDisabled) return COLORS.BUTTON_DISABLED;
  return COLORS.BUTTON_INACTIVE;
};

/**
 *
 * @param isActive What is the active condition for the button
 * @param isDisabled What is the disabled condition for the button
 * @returns The hover state color for the button based on its state
 */
export const getButtonHoverStateColors = (
  isActive: boolean,
  isDisabled: boolean
) => {
  if (isActive) return COLORS.BUTTON_ACTIVE_HOVER;
  if (isDisabled) return COLORS.BUTTON_DISABLED;
  return COLORS.BUTTON_INACTIVE_HOVER;
};

/**
 *
 * @param isActive What is the active condition for the button
 * @param isDisabled What is the disabled condition for the button
 * @returns The clicked state for the button based on its state
 */
export const getButtonClickedStateColors = (
  isActive: boolean,
  isDisabled: boolean
) => {
  if (isActive) return COLORS.BUTTON_ACTIVE_CLICK;
  if (isDisabled) return COLORS.BUTTON_DISABLED;
  return COLORS.BUTTON_INACTIVE_CLICK;
};
