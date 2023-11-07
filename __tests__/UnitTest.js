import { MissionUtils } from '@woowacourse/mission-utils';
import App from '../src/App.js';
import {
  validateAmount,
  validateBonusNumber,
  validateWinningNumbers,
} from '../src/utils/validate.js';

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickUniqueNumbersInRange = jest.fn();
  numbers.reduce((acc, number) => {
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickUniqueNumbersInRange);
};

describe('로또 구입 금액 테스트', () => {
  test('로또 구입 금액이 숫자 형식이 아니면 예외가 발생한다.', () => {
    const amount = 'abc&';
    expect(() => validateAmount(amount)).toThrow('[ERROR]');
  });

  test('로또 구입 금액이 1000보다 작으면 예외가 발생한다.', () => {
    const amount = '600';
    expect(() => validateAmount(amount)).toThrow('[ERROR]');
  });

  test('로또 구입 금액이 1000 단위가 아니면 예외가 발생한다.', () => {
    const amount = '13300';
    expect(() => validateAmount(amount)).toThrow('[ERROR]');
  });

  test('구입 금액에 따른 로또 발행 ', () => {
    const app = new App();
    app.amount = 3000;
    mockRandoms([
      [1, 2, 3, 4, 5, 6],
      [1, 2, 11, 22, 33, 44],
      [10, 17, 20, 24, 38, 41],
    ]);

    app.getLottos();
    const lottos = app.lottos;
    expect(lottos[0].numbers).toEqual([1, 2, 3, 4, 5, 6]);
    expect(lottos[1].numbers).toEqual([1, 2, 11, 22, 33, 44]);
    expect(lottos[2].numbers).toEqual([10, 17, 20, 24, 38, 41]);
  });
});

describe('로또 당첨 번호 테스트', () => {
  test('로또 당첨 번호가 1부터 45까지의 숫자 형식이 아니면 예외가 발생한다. - 1보다 작은 경우', () => {
    const winningNumbers = [0, 1, 2, 3, 4, 5];
    expect(() => validateWinningNumbers(winningNumbers)).toThrow('[ERROR]');
  });

  test('로또 당첨 번호가 1부터 45까지의 숫자 형식이 아니면 예외가 발생한다. - 45보다 큰 경우', () => {
    const winningNumbers = [1, 2, 3, 4, 47, 5];
    expect(() => validateWinningNumbers(winningNumbers)).toThrow('[ERROR]');
  });

  test('로또 당첨 번호가 1부터 45까지의 숫자가 아닌 문자가 있다면 예외가 발생한다.', () => {
    const winningNumbers = [1, 2, 't', 4, 45, 5];
    expect(() => validateWinningNumbers(winningNumbers)).toThrow('[ERROR]');
  });

  test('로또 당첨 번호가 6자리를 초과하면 예외가 발생한다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6, 7];
    expect(() => validateWinningNumbers(winningNumbers)).toThrow('[ERROR]');
  });

  test('로또 당첨 번호가 6자리 미만이면 예외가 발생한다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5];
    expect(() => validateWinningNumbers(winningNumbers)).toThrow('[ERROR]');
  });

  test('로또 당첨 번호에 중복되는 수가 있다면 예외가 발생한다.', () => {
    const winningNumbers = [1, 2, 3, 3, 5, 6];
    expect(() => validateWinningNumbers(winningNumbers)).toThrow('[ERROR]');
  });
});

describe('로또 보너스 번호 테스트', () => {
  test('로또 보너스 번호가 1부터 45까지의 숫자 형식이 아니면 예외가 발생한다. - 1보다 작은 경우', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 0;
    expect(() => validateBonusNumber(winningNumbers, bonusNumber)).toThrow(
      '[ERROR]'
    );
  });

  test('로또 보너스 번호가 1부터 45까지의 숫자 형식이 아니면 예외가 발생한다. - 45보다 큰 경우', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 50;
    expect(() => validateBonusNumber(winningNumbers, bonusNumber)).toThrow(
      '[ERROR]'
    );
  });

  test('로또 보너스 번호가 1부터 45까지의 숫자가 아닌 문자가 있다면 예외가 발생한다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 'abc';
    expect(() => validateBonusNumber(winningNumbers, bonusNumber)).toThrow(
      '[ERROR]'
    );
  });

  test('로또 보너스 번호가 당첨 번호와 중복이 되는 수라면 예외가 발생한다.', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 3;
    expect(() => validateBonusNumber(winningNumbers, bonusNumber)).toThrow(
      '[ERROR]'
    );
  });
});