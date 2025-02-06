import { before } from "@vendetta/patcher";
import { findByProps, findByName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { General } from "@vendetta/ui/components";

const Buttons = findByProps("HeaderButton", "IconButton");
const Styles = findByName("StyleSheet");

let unpatch;

// Хранилище скрытых кнопок
if (!storage.hiddenButtons) storage.hiddenButtons = {};

// Функция скрытия кнопок
export function onLoad() {
    unpatch = before("default", Buttons, (args) => {
        const buttonId = args[0]?.testID || args[0]?.accessibilityLabel;
        if (!buttonId) return;

        // Запоминаем доступные кнопки в хранилище
        if (!storage.hiddenButtons.hasOwnProperty(buttonId)) {
            storage.hiddenButtons[buttonId] = false;
        }

        // Если кнопка включена в список скрытых — скрываем её
        if (storage.hiddenButtons[buttonId]) {
            args[0].style = { display: "none" };
        }
    });
}

// Отключение плагина
export function onUnload() {
    if (unpatch) unpatch();
}

// Настройки плагина
export const settings = {
    title: "Скрытие кнопок",
    icon: "EyeOff",
    render: () => {
        return (
            <General.FormSection title="Выберите кнопки для скрытия">
                {Object.keys(storage.hiddenButtons).map((buttonId) => (
                    <General.FormSwitchRow
                        key={buttonId}
                        label={buttonId}
                        value={storage.hiddenButtons[buttonId]}
                        onValueChange={(value) => {
                            storage.hiddenButtons[buttonId] = value;
                        }}
                    />
                ))}
            </General.FormSection>
        );
    },
};
                  
