import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Inheritance Funds", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_GWEI = 1_000_000_000;

    const funds = ONE_GWEI;

    const [owner, heir, newHeir] = await ethers.getSigners();

    const InheritanceFunds = await ethers.getContractFactory("InheritanceFunds");
    const inheritanceFunds = await InheritanceFunds.deploy({ value: funds });

    return { inheritanceFunds, funds, owner, heir, newHeir };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { inheritanceFunds, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await inheritanceFunds.owner()).to.equal(owner.address);
    });

    it("Should set the right heir", async function () {
      const { inheritanceFunds, heir } = await loadFixture(deployOneYearLockFixture);

      expect(await inheritanceFunds.heir()).to.equal(heir.address);
    });

    it("Should receive and store the funds", async function () {
      const { inheritanceFunds, funds } = await loadFixture(deployOneYearLockFixture);

      expect(await ethers.provider.getBalance(inheritanceFunds.address)).to.equal(funds);
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if not called by owner", async function () {
        const { inheritanceFunds, heir, funds } = await loadFixture(deployOneYearLockFixture);

        await expect(inheritanceFunds.connect(heir).withdraw(funds)).to.be.revertedWith("Can only be called by owner");
      });

      it("Should revert with the right error if called with invalid amount", async function () {
        const { inheritanceFunds } = await loadFixture(deployOneYearLockFixture);

        // We can increase the time in Hardhat Network
        // await time.increaseTo(unlockTime);

        await expect(inheritanceFunds.withdraw(-1)).to.be.revertedWith("Enter valid withdrawal amount");
      });

      // it("Shouldn't reset idle lock expiration time", async function () {
      //   const { inheritanceFunds} = await loadFixture(
      //     deployOneYearLockFixture
      //   );

      //   await inheritanceFunds.withdraw(0);

      //   await expect(inheritanceFunds.lockExpirationTime()).to.be.equal()
      // });
    });

    // describe("Events", function () {
    //   it("Should emit an event on withdrawals", async function () {
    //     const { lock, unlockTime, lockedAmount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     await time.increaseTo(unlockTime);

    //     await expect(lock.withdraw())
    //       .to.emit(lock, "Withdrawal")
    //       .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //   });
    // });

    // describe("Transfers", function () {
    //   it("Should transfer the funds to the owner", async function () {
    //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     await time.increaseTo(unlockTime);

    //     await expect(lock.withdraw()).to.changeEtherBalances(
    //       [owner, lock],
    //       [lockedAmount, -lockedAmount]
    //     );
    //   });
    // });
  });
});
