function Checkbox({ checkOne, checkTwo, checkBoxInfo, handleChange }) {
  return (
    <div className="flex justify-between w-full mb-4">
      <p>{checkBoxInfo}</p>

      <label htmlFor="IncludeDbl" className="flex items-center">
        <input
          type="checkbox"
          name="includeDouble"
          id="IncludeDbl"
          className="mr-2"
          onChange={handleChange}
        />
        {checkOne}
      </label>
    </div>
  );
}

export default Checkbox;
