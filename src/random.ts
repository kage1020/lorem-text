export class MersenneTwister {
  private MT: number[];
  private index: number;
  private static readonly MAX_INT = 4294967296.0;
  private static readonly N = 624;
  private static readonly M = 397;
  private static readonly MATRIX_A = 0x9908b0df;
  private static readonly UPPER_MASK = 0x80000000;
  private static readonly LOWER_MASK = 0x7fffffff;

  constructor(seed: number) {
    this.MT = new Array(MersenneTwister.N);
    this.index = MersenneTwister.N + 1;
    this.seed(seed);
  }

  private seed(seed: number): void {
    this.MT[0] = seed >>> 0;
    for (let i = 1; i < MersenneTwister.N; i++) {
      this.MT[i] = (0x6c078965 * (this.MT[i - 1] ^ (this.MT[i - 1] >>> 30)) + i) >>> 0;
    }
    this.index = MersenneTwister.N;
  }

  private generateNumbers(): void {
    for (let i = 0; i < MersenneTwister.N; i++) {
      const y =
        (this.MT[i] & MersenneTwister.UPPER_MASK) |
        (this.MT[(i + 1) % MersenneTwister.N] & MersenneTwister.LOWER_MASK);
      this.MT[i] = this.MT[(i + MersenneTwister.M) % MersenneTwister.N] ^ (y >>> 1);
      if (y % 2 !== 0) {
        this.MT[i] ^= MersenneTwister.MATRIX_A;
      }
    }
  }

  public randomInt(): number {
    if (this.index >= MersenneTwister.N) {
      if (this.index > MersenneTwister.N) {
        this.seed(5489);
      }
      this.generateNumbers();
      this.index = 0;
    }

    let y = this.MT[this.index++];
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  public random(): number {
    return this.randomInt() / MersenneTwister.MAX_INT;
  }
}
