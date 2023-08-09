import styled from "styled-components";
import { colors } from "../styles";

const SScrollableArea = styled.div`
  max-height: 400px;
  overflow: scroll;
  background: rgba(${colors.lightGrey}, 0.5);
  padding: 8px;
  border-radius: 4px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(212, 212, 212);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(88, 91, 99, 0.7);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(88, 91, 99);
  }
`;

const PreformattedData = styled.pre`
  margin: 0px;
`;

type ScrollableDataProps = {
  data: string;
};

/**
 * If `data` is valid JSON, format it and return an element with scrollable overflow.
 * If `data` is just a regular string, simply return the string as a fragment.
 */
export default function ScrollableData({ data }: ScrollableDataProps) {
  try {
    return (
      <SScrollableArea>
        <PreformattedData>
          {JSON.stringify(JSON.parse(data), null, 2)}
        </PreformattedData>
      </SScrollableArea>
    );
  } catch {
    return <>{data}</>;
  }
}
