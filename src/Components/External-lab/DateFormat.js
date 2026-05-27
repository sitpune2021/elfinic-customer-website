const formatDate = (dateString) => {
    console.log('Formatting date:', dateString);
    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};
export default formatDate;