using System.Collections;
using UnityEngine;

public class MoveObject : MonoBehaviour
{
    public float moveSpeed = 2.0f;

    public Vector3[] moveDirections = new Vector3[]
    {
        Vector3.left * 2f,
        Vector3.down * 3f,
        Vector3.right * 2f,
        Vector3.up * 3f
    };

    private int currentDirectionIndex = 0;
    private Vector3 targetPosition;
    private bool isMoving = false;

    private void Start()
    {
        targetPosition = transform.position + moveDirections[currentDirectionIndex];
        isMoving = true;
    }

    private void Update()
    {
        if (isMoving)
        {
            Vector3 newPosition = Vector3.MoveTowards(transform.position, targetPosition, moveSpeed * Time.deltaTime);
            transform.position = newPosition;

            if (transform.position == targetPosition)
            {
                currentDirectionIndex = (currentDirectionIndex + 1) % moveDirections.Length;
                targetPosition = transform.position + moveDirections[currentDirectionIndex];
            }
        }
    }
}
