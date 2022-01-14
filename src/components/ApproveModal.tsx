import { Flex, Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { store } from "../store";
import { FeatherGasStation } from "../assets/FeatherGasStation";
import { observer } from "mobx-react-lite";
import { FC } from "react";

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
}
export const ApproveModal: FC<Props> = observer(({ onClose, isOpen, onSubmit }) => (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <h2>
                    Before you'll be allowed to send this transaction you need at first allow the smart contract to  transfer those tokens:
            </h2>
                <ul>
                    {Object.values(store.batch.needsApproveMap).map(token => (
                        <li key={token.token_address}>
                            {token.symbol}
                        </li>
                    ))}
                </ul>
                {store.commands.approveCommand.running && 'running'} <br/>
                {store.commands.approveCommand.failed && 'failed'} <br/>
                {store.commands.approveCommand.done && 'done'} <br/>
            </ModalBody>
            <ModalFooter>
                <Button disabled={store.commands.approveCommand.running} variant='solid' onClick={onSubmit}>
                    Approve All
                </Button>
                {store.commands.approveCommand.running && 'running'}
            </ModalFooter>
        </ModalContent>
    </Modal>
));
